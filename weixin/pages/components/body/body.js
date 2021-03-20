Component({
  data: {

    foot: {
      current: 0,
      show: true,
      list: [{
        type: "index",
        text: "首页",
        iconPath: "",
        selectedIconPath: "",
      },
      {
        type: "hero",
        text: "英雄",
        iconPath: "",
        selectedIconPath: ""
      },
      {
        type: "ming",
        text: "符文",
        iconPath: "",
        selectedIconPath: ""
      },
      {
        type: "arms",
        text: "装备",
        iconPath: "",
        selectedIconPath: ""
      },
      {
        type: "summoner",
        text: "技能",
        iconPath: "",
        selectedIconPath: ""
      }]
    },

  },

  properties: {
    footCurrent: {
      type: Number,
      value: 0,
      observer: function (newVal) {
        console.log("new val ", newVal)
        this.setData({ "foot.current": Number(newVal) })
      }
    },
    footShow: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        this.setData({ "foot.show": newVal })
      }
    },
    titleBackground: {
      type: String,
      value: 'rgba(255, 255, 255, 1)'
    },
    titleColor: {
      type: String,
      value: 'rgba(0, 0, 0, 1)'
    },
    titleText: {
      type: String,
      value: '导航栏'
    },
    titleImg: {
      type: String,
      value: ''
    },
    titleBackIcon: {
      type: String,
      value: ''
    },
    titleHomeIcon: {
      type: String,
      value: ''
    },
    titleFontSize: {
      type: Number,
      value: 16
    },
    titleIconHeight: {
      type: Number,
      value: 19
    },
    titleIconWidth: {
      type: Number,
      value: 58
    }
  },

  methods: {
  }
})