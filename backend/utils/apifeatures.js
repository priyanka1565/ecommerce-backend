
// this class is use for making api more powerfull

class ApiFeatures {

    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }
    // make search function for advance searching
    Search() {
        const keyword = this.querystr.keyword
          ? {
              name: {
                  $regex: this.querystr.keyword,
                  $options:"i"    // serching is not case sensative
              },
            }
            : {};
        console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;   // returning same object 
    }

    // make Filter function for categorywise filter 
    Filter() {
        // make copy of above object
        const queryCopy = { ...this.querystr };
        // we remove something during filter 
        const removeField = ["keyword", "page", "limit"];
        // itrate over and delete key 
        removeField.forEach((key) => delete queryCopy[key]);
        // find this return filter working on case sensetive mode
        // filter for price and rating 
        // make querystr into str
        let queryStr = JSON.stringify(queryCopy);
        // replace with regex and mongoose operator 
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`)
        // make object 
        this.query = this.query.find(JSON.parse(queryStr));
        console.log(queryStr);
        return this;
    }

    // pagination 
    pagination(resultPerPage) {
        // page var 
        const currentPage = Number(this.querystr.page);
        // skip 
        const skip = resultPerPage * (currentPage - 1);
        // limit
        this.query = this.query.limit(resultPerPage).skip(skip);
        // return same class
        return this;
    }
};

// export this class into the product controllers 

module.exports = ApiFeatures;
