
const promiseCategories = [
{
keywords:["sick","sickness","ill","illness","pain","disease","cancer","injury","hurt","healing","health","hospital","weak","weakness","body","doctor","medical","recovery","recover"],
promises:[
"I am the Lord who heals you. Exodus 15:26",
"He heals the brokenhearted and binds up their wounds. Psalm 147:3",
"By His wounds I am healed. Isaiah 53:5",
"I will restore health to you and heal you of your wounds. Jeremiah 30:17"
]
},
{
keywords:["money","fund", "fundraising", "financial","finance","broke","debt","poor","poverty","rent","bills","bill","job","work","income","salary","business","lack","struggle","tuition","school fees","fees"],
promises:[
"My God will supply my every need, according to His riches in glory. Philippians 4:19",
"The Lord will open to me His good treasure. Deuteronomy 28:12",
"The blessing of the Lord makes rich, and He adds no sorrow with it. Proverbs 10:22",
"The Lord gives me the power to get wealth. Deuteronomy 8:18"
]
},
{
keywords:["afraid","fear","fearful","anxious","anxiety","worry","worried","stress","stressed","panic","confused","uncertain","trouble","overwhelmed"],
promises:[
"Fear not, for I am with you. Isaiah 41:10",
"Cast all your burdens on Jesus. 1 Peter 5:7",
"Fear can't stay here! 2 Timothy 1:7",
"I have a sound mind. 2 Timothy 1:7",
"God will keep me in perfect peace. Isaiah 26:3"
]
},
{
keywords:["sad","grief","grieving","loss","lonely","loneliness","depressed","depression","heartbreak","broken","mourning","crying","tears"],
promises:[
"The Lord is near to the brokenhearted and saves the crushed in spirit. Psalm 34:18",
"Blessed are those who mourn, for they shall be comforted. Matthew 5:4",
"Weeping may endure for a night, but joy comes in the morning. Psalm 30:5",
"He will wipe away every tear from their eyes. Revelation 21:4"
]
},
{
keywords:["family","marriage","husband","wife","children","child","relationship","relationships","home","parent","parents","father","mother","friend","friends"],
promises:[
"I will have a God-fearing family. Joshua 24:15",
"Love bears all things, believes all things, hopes all things, endures all things. 1 Corinthians 13:7",
" I will not be lonely. Psalm 68:6"
]
},
{
keywords:["sin","guilt","shame","condemnation","addiction","temptation","stuck","bondage","dirty","regret","past"],
promises:[
"If anyone is in Christ, he is a new creation. 2 Corinthians 5:17",
"There is therefore now no condemnation for those who are in Christ Jesus. Romans 8:1",
"If we confess our sins, He is faithful and just to forgive us. 1 John 1:9",
"Whom the Son sets free is free indeed. John 8:36"
]
},
{
keywords:["future","purpose","direction","calling","dream","dreams","confused","stagnant","stuck","waiting","delay","unknown"],
promises:[
"I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. Jeremiah 29:11",
"Trust in the Lord with all your heart, and He will make straight your paths. Proverbs 3:5-6",
"Your ears shall hear a word behind you, saying, This is the way, walk in it. Isaiah 30:21",
"He who began a good work in you will bring it to completion. Philippians 1:6"
]
}
];

const fallbackPromises = [
"Come to Me, all who labor and are heavy laden, and I will give you rest. Matthew 11:28",
"Cast your burden on the Lord, and He will sustain you. Psalm 55:22",
"There is hope for your future, declares the Lord. Jeremiah 31:17",
"Behold, I am making all things new. Revelation 21:5",
"The Lord is good, a stronghold in the day of trouble; He knows those who take refuge in Him. Nahum 1:7",
"The name of the Lord is a strong tower; the righteous run to it and are safe. Proverbs 18:10",
"God is our refuge and strength, a very present help in trouble. Psalm 46:1"
];

function getPromiseForText(text){
const normalizedText = text.toLowerCase();

for(const category of promiseCategories){
const hasMatch = category.keywords.some(keyword => normalizedText.includes(keyword));

if(hasMatch){
return category.promises[Math.floor(Math.random() * category.promises.length)];
}
}

return fallbackPromises[Math.floor(Math.random() * fallbackPromises.length)];
}

function normalizeSingleWord(value){
return value.replace(/\s+/g, "").slice(0, 30);
}

const feelingInput = document.getElementById("feelingInput");

if(feelingInput){
feelingInput.addEventListener("input", event=>{
event.target.value = normalizeSingleWord(event.target.value);
});

feelingInput.addEventListener("keydown", event=>{
if(event.key === " "){
event.preventDefault();
}
});

feelingInput.addEventListener("paste", event=>{
event.preventDefault();
const pastedText = (event.clipboardData || window.clipboardData).getData("text");
event.target.value = normalizeSingleWord(pastedText);
});
}

async function submitFeeling(){

const text = normalizeSingleWord(document.getElementById("feelingInput").value.trim());
if(!text) return alert("Enter a word");

const button = document.querySelector(".input-area button");
button.disabled = true;
button.textContent = "Submitting...";

const { error } = await supabaseClient.from("entries").insert({feeling:text});

button.disabled = false;
button.textContent = "Receive a Promise";

if(error){
console.error("Supabase insert failed:", error);

let message = "Something went wrong. Please try again.";

if(error.message){
message = error.message;
}

if(error.message && error.message.toLowerCase().includes("row-level security")){
message = "Supabase is blocking public inserts. Enable an INSERT policy for the anon role on the entries table.";
}

if(error.message && error.message.toLowerCase().includes("null value in column \"id\"")){
message = "Your entries.id column needs to auto-generate values. Change it to an identity/serial primary key in Supabase.";
}

return alert(message);
}

const selectedPromise = getPromiseForText(text);

document.getElementById("promiseText").innerText = selectedPromise;
document.getElementById("promiseBox").classList.remove("hidden");

document.getElementById("feelingInput").value="";
// Hide the input and button
document.getElementById("inputArea").classList.add("hidden");
}
