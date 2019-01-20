var clickCounter = new Vue({
  el: '#click-counter',
  data: {
    clickCount: 0
  },
  methods: {
    addClick: function(){
      this.clickCount++;
    }
  }
});