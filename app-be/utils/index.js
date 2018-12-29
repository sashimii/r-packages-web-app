const getPackageURL = (baseURL, package, version) => `${baseURL}${package}_${version}.tar.gz`;

const getUniqueAuthorsList = (packages) => {
  const authorList = packages.reduce((acc, {authors}) => {
    const _authors = authors.reduce((acc, author) => {
      return Object.assign(acc, { [author.name]: author });    
    }, {});
    return Object.assign(acc, _authors); 
  }, {});
  return Object.values(authorList);
}

module.exports = {
  getPackageURL,
  getUniqueAuthorsList
}