var firebaseConfig = {
  apiKey: "provided apiKey",
  authDomain: "provided authDomain",
  databaseURL: "provided databaseURL",
  projectId: "provided projectId",
  storageBucket: "provided storageBucket",
  messagingSenderId: "provided messagingSenderId",
  appId: "provided appId"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var db = firebase.firestore()

if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name;

document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})


document.querySelector("#message-form").addEventListener('submit', (e) => {
  // name = 
  e.preventDefault();
  let message = document.querySelector('#message-input').value;
  db.collection('message')
    .add({
       name: name,
       message: message,
       date: firebase.firestore.Timestamp.fromMillis(Date.now())
      })
    .then(docRef => {
      console.log(`Document written with ID: ${docRef.id}`);
      document.querySelector('#message-form').reset();
    })
    .catch(error => {
      console.log(`Error adding document : ${error}`);
    })
});

db.collection('message')
.orderBy('date', 'asc')
  .onSnapshot(snapshots => {
    document.querySelector('#messages').innerHTML = '';
    snapshots.forEach(snapshot => {
      let messageDiv = document.createElement('div');
      messageDiv.innerHTML = `
      <p class="name">${snapshot.data().name}</p>
      <p>${snapshot.data().message}</p>
      `;
      document.querySelector('#messages').prepend(messageDiv);
    })
  })


  document.querySelector('#clear').addEventListener('click', () => {
    db.collection('message')
    .get()
    .then(snapshots => {
      snapshots.forEach(snapshot => {
        db.collection('message').doc(snapshot.id).delete()
        .then(() => {
          console.log('Document Successfully deleted');
        })
        .catch(error =>{
          console.log(`Error getting documents: ${error}`)
        })
      })
    })
  })