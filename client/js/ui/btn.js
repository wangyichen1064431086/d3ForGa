class showAndHide {
  constructor(clickBtn, showSections, hideSections) {
    /**
     * @param clickBtn: Type String|HTMLElement,为点击的按钮元素的Id字符串或点击的按钮元素本身
     */
    if(!(clickBtn instanceof HTMLElement)) {
      clickBtn = document.getElementById(clickBtn);
    }
    if(clickBtn instanceof HTMLElement) {
      this.clickBtn = clickBtn;
    } else {
      console.log('The param clickBtn is not an HTMLElement');
      return;
    }

    if (showSections && showSections instanceof Array) {
      this.showSections = [];
      let showSection;
      for(const item of showSections) {
        if(!(item instanceof HTMLElement)) {
          showSection = document.getElementById(item);
        } else {
          showSection = item;
        }
        if(showSection instanceof HTMLElement) {
          this.showSections.push(showSection);
        }
      }
    }

    if (hideSections && hideSections instanceof Array) {
      this.hideSections = [];
      let hideSection;
      for(const item of hideSections) {
        if(!(item instanceof HTMLElement)) {
          hideSection = document.getElementById(item);
        } else {
          hideSection = item;
        }
        if(hideSection instanceof HTMLElement) {
          this.hideSections.push(hideSection);
        }
      }
    }


    this.clickBtn.addEventListener('click', () => {
      this.show();
      this.hide();
    }, false);

  }

  show() {
    const showSections = this.showSections;
    for(const item of showSections) {
      item.style.display = 'block';
    }
  }

  hide() {
    const hideSections = this.hideSections;
    for(const item of hideSections) {
      item.style.display = 'none';
    }
  }

    static chooseRole() {
      new showAndHide ('noneDeveloper',[],['dataShowSec','editRequest']);
      new showAndHide ('readDeveloper',['dataShowSec'],['editRequest']);
      new showAndHide ('editDeveloper',['editRequest'],['dataShowSec']);
    }
}

export default showAndHide;