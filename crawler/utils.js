const getPackageURL = (baseURL, package, version) => `${baseURL}${package}_${version}.tar.gz`;



module.exports = {
  getPackageURL,
}