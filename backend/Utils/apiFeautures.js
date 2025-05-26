class ApiFeautures {
  constructor(query, queryStr) {
    this.query = query; // Product.find()
    this.queryStr = queryStr; // req.query object
    this.filterObj = {}; // Object to accumulate all filters
  }

  search() {
    //  if (this.queryStr.category) { // if you want to igonre keyword filter category  below code or you need independent keyword and category filter uncomment this code
    // return this;
    // }

    const searchKeyword = this.queryStr.keyword;
    const search = searchKeyword
      ? {
          name: {
            $regex: searchKeyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...search });
    return this;
  }

  filter() {
    const queryStrCopy = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((key) => delete queryStrCopy[key]);

    const mongoFilter = {};

    for (const key in queryStrCopy) {
      if (key.includes("[")) {
        const [field, opWithBracket] = key.split("[");
        const operator = opWithBracket.replace("]", "");

        if (!mongoFilter[field]) {
          mongoFilter[field] = {};
        }

        mongoFilter[field][`$${operator}`] = Number(queryStrCopy[key]);
      } else {
        if (key === "category") {
          mongoFilter[key] = { $regex: queryStrCopy[key], $options: "i" };
        } else {
          mongoFilter[key] = queryStrCopy[key];
        }
      }
    }

   // console.log("MongoDB filter object:", mongoFilter); // <--- add this line

    this.query = this.query.find(mongoFilter);
    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeautures;
