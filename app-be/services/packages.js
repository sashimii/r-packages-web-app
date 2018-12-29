const { Package, Author } = require('../model/schema');

const getPackagesByPage = async (limit, pageNum) => {
  const data = await Package.findAndCountAll();
  
  let pages = Math.ceil(data.count / limit);
  const offset = limit * (pageNum - 1);

  const packages = await Package.findAll({
    limit,
    offset,
    include: {
      model: Author,
    }
  });

  return {
    result: packages.map((package) => package.toJSON()),
    count: data.count,
    page: pageNum, 
    pages
  };

};

const getPackageById = async (id) => {
  const package = await Package.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Author
      }
    ]
  });
  return package.toJSON();

}

module.exports = {
  getPackageById,
  getPackagesByPage
}