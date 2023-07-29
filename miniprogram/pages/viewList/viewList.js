// pages/viewList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        objectArray: [
            {id: 5, unique: 'unique_5'},
            {id: 4, unique: 'unique_4'},
            {id: 3, unique: 'unique_3'},
            {id: 2, unique: 'unique_2'},
            {id: 1, unique: 'unique_1'},
            {id: 0, unique: 'unique_0'},
          ],
          numberArray: [1, 2, 3, 4],
          value1: 1
    },

    switch: function(e) {
        const length = this.data.objectArray.length
        for (let i = 0; i < length; ++i) {
          const x = Math.floor(Math.random() * length)
          const y = Math.floor(Math.random() * length)
          const temp = this.data.objectArray[x]
          // swap two elements
          this.data.objectArray[x] = this.data.objectArray[y]
          this.data.objectArray[y] = temp
        }
        this.setData({
          objectArray: this.data.objectArray
        })
    },

    switch2: function(){
        console.log("Switch")
        var numArray = this.data.numberArray
        for (var i = 0; i < numArray.length; ++i){
            const x = Math.floor(Math.random() * numArray.length)
            const y = Math.floor(Math.random() * numArray.length)
            const temp = numArray[x]
            numArray[x] = numArray[y]
            numArray[y] = temp
        }
        console.log(numArray)
        this.setData({
            numberArray: numArray
        })
    },

    addToFront: function(e) {
        const length = this.data.objectArray.length
        this.data.objectArray = [{id: length, unique: 'unique_' + length}].concat(this.data.objectArray)
        this.setData({
            objectArray: this.data.objectArray
        })
    },
    addNumberToFront: function(e){
        this.data.numberArray = [ this.data.numberArray.length + 1 ].concat(this.data.numberArray)
        this.setData({
            numberArray: this.data.numberArray
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})