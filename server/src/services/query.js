const DEFAULT_PAGE_LIMIT = 0; // IF query limit is not set, Mongo will return all 


function getPagination(query){
    const limit = Math.abs(query.limit) || 1;
    const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;

    const skip = (page - 1) * limit; // page 1, 2, 3

    return{ 
        skip,
        limit,
    }

}

module.exports={
    getPagination,
}