const axios = require('axios');
const https = require('https');
const zlib = require('zlib');
const fs = require('fs');
const tar = require('tar-stream');

const { getPackageURL } = require('./utils');

require('dotenv').config();

const { saveAllPackageDescriptions } = require('../app-be/services/packages');

const CRAN_REPO_BASE_URL = `https://cran.r-project.org/src/contrib/`;
const CRAN_REPO_PACKAGES_URL = `${CRAN_REPO_BASE_URL}PACKAGES`;
const PACKAGE_LIMIT = 500;
const PACKAGE_LIST_DELIMITER = `\n\n`;


const fetchRawPackageList = async () => {
  const res = await axios.get(CRAN_REPO_PACKAGES_URL);
  if( res.status !== 200) {
    throw Error(res.statusText);
  }
  return res.data;
} 

const fetchCleanPackageList = async () => {
  const rawPackageList = await fetchRawPackageList();
  const cleanPackageList = 
  rawPackageList
    .split(PACKAGE_LIST_DELIMITER) // Splits string into array strings of individual packages
    .slice(0, PACKAGE_LIMIT)       // Establishing limit
    .join(PACKAGE_LIST_DELIMITER)  // Join to create a smaller list
    .split('\n')
    .reduce((acc, currentItem, index) => {
      // Check if line contains the start of a field
      if(currentItem.indexOf(': ') > -1) {
        return [ ...acc, currentItem ];
      }
      
      let previousItem = acc.length > 0 && acc[acc.length - 1]; // Get the previous item

      // Concatenates lines with no fields to a line with a field.
      // Also does away with the lingering empty string
      acc[acc.length - 1] = previousItem + ` ${currentItem.trim()}`; 
      return acc;
    }, [])
    .reduce((acc, currentItem, index) => {

      const [ key, value ] = currentItem.split(': ');

      if(key === 'Package') {
        return [...acc, { [key]: value }];
      }
      
      // Convert comma separated list into an array
      const lastItemindex = acc.length - 1;
      acc[lastItemindex][key] =
        value && value.indexOf(',') > -1 ? 
            value.split(/,\s*/)
          : value;

      return acc;
    }, [])

    return await cleanPackageList;

}


const extractPackageDescription = (baseURL, package, version) => {

  return new Promise((resolve, reject) => {

    const extract = tar.extract();
    let data = '';
    const packageURI = getPackageURL(baseURL, package, version);
  
    extract.on('entry', function(header, stream, cb) {
        stream.on('data', function(chunk) {
          // console.log(header.name);
        if (header.name == `${package}/DESCRIPTION`)
          data += chunk;
          // console.log('data'. data);
        });
  
        stream.on('end', function() {
            cb();
        });
  
        stream.resume();
    });
  
    extract.on('finish', function() {

      const description =
        data
          .split('\n')
          // Get Rid of Tab space and append to prior line
          .reduce((acc, currentItem, index) => {
            // Check if line contains the start of a field, and that the first character is not whitespace
            if(currentItem.indexOf(': ') > -1 && currentItem.charAt(0) !== ' ') {
              return [ ...acc, currentItem ];
            }
            
            let previousItem = acc.length > 0 && acc[acc.length - 1]; // Get the previous item
    
            // Concatenates lines with no fields to a line with a field.
            // Also does away with the lingering empty white space
            acc[acc.length - 1] = previousItem + ` ${currentItem.trim()}`; 

            return acc;

          }, [])
          // Converts to JS Object:
          /** 
           *  Converts to JS Object:
           *    - converts keys (Fields: ) to camelCase
           *    - converts fields expected to be comma separated lists to arrays
           * */
          .reduce((acc, currentItem) => {
            
            let [ key, value ] = currentItem.split(': ');
            // Convert comma separated list into an array
            let cleanedValue;
            if (key === 'Depends' || key === 'Suggests' || key === 'Imports') {
              cleanedValue = value.split(/,\s*/)
            } else if (key === 'Author') {
              // Get rid of author type between brackets `[aut, etc]` before returning an array of authors
              const authorTypeRegex = /\[(.*?)\]/g;
              let authors =
                value
                  .replace(authorTypeRegex, '')
                  .trim()
                  .split(' , ')
                  .map(name => {
                    return { name };
                  });
              cleanedValue = authors;
              key = `${key}s`; // Make Plural
            } else if (key === 'Maintainer' || key === 'Contact') {
              const [info] = value.split('>');
              let [name, email] = info.split(' <');
              cleanedValue = {
                name,
                email,
                isMaintainer: key === 'Maintainer',
                isContact:  key === 'Maintainer' || key === 'Contact',
              };
            } else if (key === 'Date/Publication') {
              key = key.replace('/', '');
            } else {
              // Assumes value is inherently clean if the aforementioned keys are not associated with the value
              cleanedValue = value;
            }

            // convert key to camelCase at the end of parsing
            key = key.charAt(0).toLowerCase() + key.slice(1);
            // console.log('Key', key);
            return Object.assign(acc, { [key]: cleanedValue });

          }, {})

          /**
           * Place Contact & Maintainer Emails in Author List
           */
          if(description.maintainer || description.contact) {
            description.authors = description.authors.map(author => {
                return  author.name === description.maintainer.name ||
                        author.name === (description.contact && description.contact.name) ? 
                            Object.assign(author, description.maintainer, description.contact)
                          : author;
            });
          }

        resolve(description);

      });
  
    const request = https.get(packageURI); 
    request.on('response', response => {
      response
        .pipe(zlib.createGunzip())
        .pipe(extract);
    })
    .on('error', reject);

  });
  

}



const fetchPackageDescriptions = async () => {
  const packages = await fetchCleanPackageList();
  const descriptions = packages.map(({Package, Version}) => {
    return extractPackageDescription(CRAN_REPO_BASE_URL, Package, Version)
  });
  return await Promise.all(descriptions);
}

fetchPackageDescriptions().then((descriptions) => {
  let countAuthors = 0;
  descriptions.forEach((description) => {
    if(description.maintainer) {
      countAuthors++;
    }
  });
  console.log(descriptions.length, countAuthors);
  saveAllPackageDescriptions(descriptions);
  fs.writeFile('DESCRIPTIONS.json', JSON.stringify(descriptions, null, 2), (err) => { if(err) throw err})
})
.catch(console.error);

