
async function loadCloud(){

const {data, error} = await supabaseClient.from("entries").select("feeling");

if(error || !data){
return;
}

const counts = {};

data.forEach(row=>{
const word=row.feeling.trim().toLowerCase();
if(!word) return;
counts[word]=(counts[word]||0)+1;
});

const cloud=document.getElementById("cloud");
cloud.innerHTML="";

const entries = Object.entries(counts)
.sort((a, b)=>b[1] - a[1] || a[0].localeCompare(b[0]))
.slice(0, 36);

const maxCount = entries.length ? entries[0][1] : 1;
const minCount = entries.length ? entries[entries.length - 1][1] : 1;
const spread = Math.max(maxCount - minCount, 1);

entries.forEach(([word,count], index)=>{

const el=document.createElement("div");
el.className="word";
el.innerText = count > 1 ? word + " (" + count + ")" : word;

const normalizedSize = (count - minCount) / spread;
const sizeStep = entries.length > 20 ? 14 : 18;
const fontSize = 16 + normalizedSize * sizeStep;

el.style.fontSize = Math.min(fontSize, 34) + "px";
el.style.setProperty("--float-duration", (8 + (index % 5) * 1.4) + "s");
el.style.setProperty("--float-delay", ((index % 7) * 0.35) + "s");
el.style.setProperty("--tilt", (((index % 5) - 2) * 1.5) + "deg");

cloud.appendChild(el);

});

}

loadCloud();
setInterval(loadCloud,4000);
