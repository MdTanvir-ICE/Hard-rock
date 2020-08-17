const simpleResult = document.getElementById("simple-result");
const searchResult = document.getElementById("searchResult");
const api='https://api.lyrics.ovh';

//when click search button
searchBtn.addEventListener('click',function(){
    const query = document.getElementById("searchLyric").value;
    if(query != "") getResult(query);
    else alert('please input some lyric text....');

    document.getElementById('lyricSimple').innerHTML="<h1></h1>";
    document.getElementById('lyricFancy').innerHTML="<h1></h1>";

});

//fetch data from lyric.ovh
function getResult(query)
{
    fetch(`${api}/suggest/${query}`)
    .then(data => data.json())
    .then (displayResults);
}

//display the search result

function displayResults (result)
{
    const duration= result.data.map(song =>{
        let time=song.duration/60;
        time = time.toFixed(2);
        return time;
    });
  const songName= result.data.map(song=>song.title);
  const songArtist = result.data.map(song=>song.artist.name);
  const len = songName.length>=10? 10 : songName.length;

   //when no lyric found
  if(len==0)alert('No lyric found');

  let string='';
  let string1='';

  //for fancy result "string"
  //for simple result "sting1"
   for(let i=0;i<len;i++)
   {
        string+=`<div class="single-result row align-items-center my-3 p-3">
                        <div class="col-md-9">
                            <h3 id="lyric" class="lyrics-name">${songName[i]}</h3>
                            <p id="artist" class="author lead">Album by <span>${songArtist[i]}</span></p>
                            <p><span>Duration: </span>${duration[i]}<span> min</span></p>
                        </div>
                        <div class="col-md-3 text-md-right text-center">
                            <button data-artist="${songArtist[i]}" data-title="${songName[i]}" id="get-lyric" class="btn btn-success">Get Lyrics</button>
                        </div>
                
                    </div>`

        string1+=`<div class=" simple d-flex justify-content-between">
                    <div>
                        <p class="author lead"><strong>${songName[i]}</strong> Album by <span>${songArtist[i]}</span> </p>
                    </div>
                    <div>
                        <p class="author lead" "><button data-artist="${songArtist[i]}" data-title="${songName[i]}" class="btn btn-success" >Get Lyrics</button> </p>
                    </div>
                 </div>`


                simpleResult.innerHTML=`${string1}`;
                searchResult.innerHTML=`<div class="search-result col-md-8 mx-auto py-4">

                                            ${string}
            
                                    </div>`
    }
}

//fetch lyric for fancy style  
searchResult.addEventListener('click',e => {
    const clicked = e.target;

    if(clicked.tagName === 'BUTTON'){

        const songArtis = clicked.getAttribute('data-artist');
        const songName = clicked.getAttribute('data-title');
        
        fetch(`${api}/v1/${songArtis}/${songName}`)
        .then(data => data.json())
        .then(data =>displayLyric(data,songArtis,songName))
    }
    
})

//fetch lyric for simple style
simpleResult.addEventListener('click',e => {
    const clicked = e.target;

    if(clicked.tagName === 'BUTTON'){

        const songArtis = clicked.getAttribute('data-artist');
        const songName = clicked.getAttribute('data-title');
        // console.log(songArtis,songName);
        fetch(`${api}/v1/${songArtis}/${songName}`)
        .then(data => data.json())
        .then(data =>displaySimpleLyric(data,songArtis,songName))
    }
    
})

//for display fancy lyric
function displayLyric(data,songArtist,songName){
  
    if(data.lyrics==undefined){
        document.getElementById('lyricFancy').innerHTML="<h1>SORRY! NOT FOUND</h1>";
        alert("Sorry no lyric found"); 
    }

    else{
        const lyric = data.lyrics.replace(/(\r\n|\r|\n)/gi,'<br>');
        
        const string =`<h1  class='text-success mb-4'>${songArtist} - ${songName}</h1>
                                <h5 id='fulll-lyric' class='lyric text-white'>
                                   ${lyric}
                                   
                                </h5>`
        document.getElementById('lyricFancy').innerHTML=string;
    } 
}

//for display simpe lyric
function displaySimpleLyric(data,songArtist,songName)
{
    if(data.lyrics==undefined){
        alert("Sorry no lyric found");
        document.getElementById('lyricSimple').innerHTML="<h1></h1>";
    }
    else{
        const lyric = data.lyrics.replace(/(\r\n|\r|\n)/gi,'<br>');
        const string =`<h1  class='text-success mb-4'>${songArtist} - ${songName}</h1>
                                <h5 id='fulll-lyric' class='lyric text-white'>
                                   ${lyric}
                                   
                                </h5>`
        document.getElementById('lyricSimple').innerHTML=string;
    }   
   
}


