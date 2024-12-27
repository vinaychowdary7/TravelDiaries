import React from 'react'

const LoadMoreDataBtn = ({state,fetchDataFunc}) => {

    if(state!=null && state.totalDocs>state.results.length){
        return (
            <button 
            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex itmes-center gap-2'
            onClick={()=>fetchDataFunc({page:state.page+1})}
            >
                Load More
            </button>
        )
    }
}

export default LoadMoreDataBtn
