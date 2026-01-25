export default
function react(state) {
  const chan = document.getElementById("tuduChan");
  chan.setAttribute('class', `tudu-chan tudu-chan--${state}`);
  setTimeout(() => {
    chan.setAttribute('class', 'tudu-chan tudu-chan--idle');
  }, 900);
}