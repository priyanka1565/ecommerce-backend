// we are handlling async await error here

module.exports = (theFunc) => (req, res, next) => {
    // this try block error 
    Promise.resolve(theFunc(req, res, next))
        // this will handle catch block
        .catch(next);
}

// export same things product controllers 