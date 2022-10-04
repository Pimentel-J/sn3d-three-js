//https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-javascript?view=aspnetcore-6.0

const uri = 'https://localhost:5001/api/';
const userIdTest = 'c63ca8de-d0e1-4ab4-a142-135c6ea59ed4';

function getUserNetwork(id){
    fetch(uri + 'Connections/' + userIdTest + '/all')
        .then(res => res.json())
        .then(data =>console.log(data))
        .catch(error => console.error('Unable to get user network', error))
}
