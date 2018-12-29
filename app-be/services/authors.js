const { Author, Package } = require('../model/schema');


const getAuthorInfo = async (id) => {
  const authorInfo = await Author.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Package
      }
    ]
  });

  return authorInfo.toJSON();
}


module.exports = {
  getAuthorInfo
}

