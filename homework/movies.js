firebase.auth().onAuthStateChanged(async function(user){

console.log('HI')
console.log(user)
  if(user){
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <p class="text-white-500">Hello ${user.displayName}<p>
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `

    document.querySelector('.sign-out').addEventListener('click', function(event) {
      
      firebase.auth().signOut()
      document.location.href = 'movies.html'
    })

  let url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=73ad26890b2d9c27d56568cdaca63f87&language=en-US'
  let response = await fetch(url)
  let json = await response.json()
  let movies = json.results
  console.log(movies)
  let db = firebase.firestore()
  
  
  let watchedMovie = await db.collection('watched').get()
  let views = watchedMovie.docs
  for (let i = 0; i < movies.length; i++) {
    let opacity =''
    for (let j=0; j<views.length; j++) {
      if(views[j].id.localeCompare(`movie-${movies[i].id}`)==0){
        opacity='opacity-20'
        break;
      }
    }
    document.querySelector('.movies').insertAdjacentHTML('beforeend', `
      <div class="w-1/5 p-4 movie-${movies[i].id}-${user.uid} ${opacity}">
        <img src="https://image.tmdb.org/t/p/w500/${movies[i].poster_path}" class="w-full">
        <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
      `)
  }

  let filters = document.querySelectorAll(`[class*="movie-"]`)
  
    for (var i = 0, element; element = filters[i]; i++) {
      
      element.addEventListener('click',async function(event){
        event.preventDefault()
 
        
        let movieId = ''
        classList = this.className.split(' ')
        for(var i = 0; i<classList.length ; i++){
          if(classList[i].indexOf('movie-')>=0){
            movieId = classList[i]
          }
        }
    
        
        if(this.classList.contains('opacity-20')){
          this.classList.remove('opacity-20')
          db.collection('watched').doc(movieId).delete()
        }else{
          this.classList.add('opacity-20')
          db.collection("watched").doc(movieId).set({
          })
        }
        
      })
    }
  } else {
    let ui = new firebaseui.auth.AuthUI(firebase.auth())
  
    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'movies.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)

  }
  
  
})