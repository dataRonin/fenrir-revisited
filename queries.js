/*

var emitter = function(message, data){
        console.log("emitter used")
        socket.emit(message, data);
}

var exposeCurrentState = function(err, results){
    currentState = results;
    emitter("currentState", {data:currentState});
}
function getOneDeskNow(err, c, cb) {

	var exposeCurrentState = function(err, results){
    		currentState = results;
    		emitter("currentState", {data:currentState});
	}

	results = [];
	var query= "select mac, state, capture_at from desk where mac=$1";
	c.query(query, ['6ecc4c'], (err, result) => {
	if (err) {
		console.log(err)
	}
        
	if ( result.rows.length == 1 ) {
		var d = {state : result.rows['state'][0]),
                     capture_at : result.rows['capture_at'][0],
                     mac : result.rows['mac'][0] 
	    }
	    results.push(d);
	}
	exposeCurrentState(null, results);
	
});
	
}

function getAllDeskNow(err, client cb) {

}
*/
