const createelement = arr => {
  const hemlelements = arr.map(el => `<span class="btn">${el}</span>`);
  return hemlelements.join(' ');
};
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-EN'; // English
  window.speechSynthesis.speak(utterance);
}

const managespinner = status => {
  if (status == true) {
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  } else {
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
};

const loadlession = () => {
  const url = 'https://openapi.programming-hero.com/api/levels/all';
  fetch(url)
    .then(res => res.json())
    .then(json => displaylession(json.data));
};
const removebtn = () => {
  const removebtn = document.querySelectorAll('.btn-lession');
  // console.log(removebtn);
  removebtn.forEach(btn => btn.classList.remove('active'));
};
const loadlevelword = id => {
  managespinner(true);
  // console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  // console.log(url);
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const lessionbtn = document.getElementById(`lession-btn-${id}`);
      // console.log(lessionbtn);
      removebtn();
      lessionbtn.classList.add('active');
      displayword(data.data);
    });
};

const displayword = wordes => {
  // console.log(wordes);
  const wordcontainer = document.getElementById('word-container');
  wordcontainer.innerHTML = '';

  if (wordes.length == 0) {
    wordcontainer.innerHTML = `<div class="space-y-4 text-center col-span-full ">
     <img class="mx-auto" src="./assets/alert-error.png" alt="">
      <p class="font-normal text-[13px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h3 class="font-medium text-4xl">নেক্সট Lesson এ যান</h3>
    </div>`;
  }
  managespinner(false);
  // return;

  for (let word of wordes) {
    // console.log(word);
    const newdiv = document.createElement('div');
    newdiv.innerHTML = `
    <div class="bg-slate-100 rounded-sm py-10 px-5 text-center space-y-4 ">
      <h2 class="font-bold text-3xl">${word.word ? word.word : 'No word Found'}</h2>
      <h3 class="font-medium text-xl">Meaning /Pronounciation</h3>
      <h2 class="font-bold text-3xl">${word.meaning ? word.meaning : 'No found meaning'}/ ${word.pronunciation ? word.pronunciation : 'No found pronounciation '}</h2>
      <div class=" flex justify-between px-6 items-center  ">

        <button onclick="loadwordetail(${word.id})" class="btn bg-slate-300 hover:bg-blue-500"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick="pronounceWord('${word.word}')" class="btn bg-slate-300 hover:bg-blue-500"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
    `;
    wordcontainer.append(newdiv);
  }
  managespinner(false);
};

const displaylession = lessions => {
  // console.log(lessions);
  const lessionId = document.getElementById('btn-container');
  // console.log(lessionId);
  lessionId.innerHTML = '';
  for (let lession of lessions) {
    const divCre = document.createElement('div');
    divCre.innerHTML = `<button id="lession-btn-${lession.level_no}" onclick="loadlevelword(${lession.level_no})" class="btn btn-outline btn-primary btn-lession"><i class="fa-solid fa-book-open"></i>lession -${lession.level_no}</button>`;
    lessionId.append(divCre);
  }
};
const loadwordetail = async id => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  // console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayworddetails(details.data);
};

const displayworddetails = word => {
  console.log(word);
  const detailbox = document.getElementById('word-detials');
  detailbox.innerHTML = ` '<div>
          <h2 class="font-semibold text-4xl">${word.word}(<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
        </div>
        <div>
          <h3 class="font-semibold text-2xl">Meaning</h3>
          <p class="font-medium text-2xl">${word.meaning}
          <p>
        </div>
        <div>
          <h3 class="font-semibold text-2xl">Example</h3>
          <p class="font-normal text-2xl">${word.sentence}</p>
        </div>


        <div class="">
          <h3 class="font-medium text-2xl">সমার্থক শব্দ গুলো</h3>
          <div class="flex gap-4">
            ${createelement(word.synonyms)}
          </div>
        </div>`;
  document.getElementById('word_model').showModal();
};

loadlession();

document.getElementById('btn-search').addEventListener('click', () => {
  removebtn();
  const input = document.getElementById('search-input');
  const searchvalur = input.value.trim().toLowerCase();
  console.log(searchvalur);

  fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
      const allwordes = data.data;
      console.log(allwordes);
      const filterwordes = allwordes.filter(word =>
        word.word.toLowerCase().includes(searchvalur),
      );
      displayword(filterwordes);
    });
});
