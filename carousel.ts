
interface Images{
  imageLink:string,
  alt:string
}


class Carousel extends HTMLElement {

    
    /**
     *   Store all images 
     * */ 
     private imageArray=new Array<Images>();
    /**
     *  
     *  Store current element slide number
     */
     private currentElementSlide:number=0;
    /**
     * 
     *  Store carousel items
     */
     private carouselItems=new Array<any>();
     /**
      * 
      *  Store all bullets
      */
     private bulletItems=new Array<any>();
    
     
      private timerAnimation:any;
    constructor() {
      super(); // Always call super() first when extending HTMLElement
      /**
       * 
       *  Add images to image array
       * 
       */
      this.imageArray.push({imageLink:'Images/Slide1.jpg',alt:'Travel 1'});
      this.imageArray.push({imageLink:'Images/Slide2.jpg',alt:'Travel 2'});
      this.imageArray.push({imageLink:'Images/Slide3.jpg',alt:'Travel 3'});
      this.imageArray.push({imageLink:'Images/Slide4.jpg',alt:'Travel 4'});
     
      
    
    }
  
    // Called when the element is added to the DOM
    connectedCallback(): void {
     /**
      * 
      *   Create wrapper object
      * 
      */
     const wrapper = document.createElement('div');
     /**
      * 
      *  add css class images-container_1 to wrapper element 
      * 
      */
     wrapper.classList.add('images-container_1');
      let bulletContainer=document.createElement('div');
      let bulletNumber:number=1;
      bulletContainer.classList.add('bullet');
     this.imageArray.forEach((elm,index)=>{
     let  divContainer=document.createElement('div');
          divContainer.classList.add('container-item');
          /**
           *   Add each image to Div Container Element
           * 
           */
      let imgContent=document.createElement('img');
          imgContent.setAttribute('src',elm.imageLink);
          imgContent.setAttribute('alt',elm.alt);
          imgContent.classList.add('img');
          divContainer.appendChild(imgContent);
          /**
           *  Add bullet to the Div Container
           * 
           */
          let bullet=document.createElement('span');
          bullet.innerHTML=""+(bulletNumber++);
          bullet.classList.add("bullet-de-active");
          this.bulletItems.push(bullet);
          bulletContainer.appendChild(bullet);
          wrapper.appendChild(divContainer);
          this.carouselItems.push(divContainer);
   })

   this.bulletItems[0].classList.add('bullet-active');
   this.bulletItems.forEach((elm,index)=>{

      elm.addEventListener('click',()=>{this.bulletedElement(elm,index)});
   
   })
   wrapper.appendChild(bulletContainer);
   /**
    *   Create Next Button
    */
   const nextButton=document.createElement('div');
   /**
    * 
    *  Add css class navigation-right to nextButton
    * 
    */
   nextButton.classList.add('navigation-right');
   /**
    *   on click next button clearInterval(timerAnimation),call next_elm()
    * ,start timerAnimation after 6000
    * 
    */
   nextButton.addEventListener('click',()=>{clearInterval(this.timerAnimation);
                                            this.next_elm();
                                            setTimeout(this.animation_time,6000);});
    /**
     *
     *  Add next button to the wrapper 
    */
   wrapper.appendChild(nextButton);
   /**
    * Create Previous Button
    * 
    * 
    */
   const previousButton=document.createElement('div');
   
   previousButton.classList.add('navigation-left');
   /**
    *  
    *  on click previous button clearInterval(timerAnimation),call previous_elm()
    * ,start timerAnimation after 6000
    * 
    * 
    */
   previousButton.addEventListener('click',()=>{clearInterval(this.timerAnimation);
                                              this.previous_elm();
                                              setTimeout(this.animation_time,6000);
                                            });
   wrapper.appendChild(previousButton);
     this.appendChild(wrapper);
     this.carouselItems[0].classList.add('active'); 
     
     let touchStartX:number=0;
     let touchEndX:number=0
     /**
      *   during mouseenter event in the wraper  clearInterval timerAnimation
      *   mouseout event in the wrapper start timerAnimation 
      * 
      */
     this.carouselItems.forEach((elm,index)=>{
             elm.addEventListener("mouseenter",()=>{
                    clearInterval(this.timerAnimation);
            })
            elm.addEventListener("mouseout",()=>{
              this.animation_time();
      })
      /***
       *   in touch start event  
       *           touchStartX =event.changedTouches[0].screenX;
       *   in touch end event
       *           touchEndX=event.changedTouches[0].screenX;
            
       *    if touchEndX<touchStartX and touchStartX-touchEndX>30 then
               call next_elm()
            if touchEndX>touchStartX and touchStartX-touchEndX>30 then
               call previous_elm()
       * 
       */
            elm.addEventListener("touchstart",(evt:any)=>{
                    evt.preventDefault();
                    touchStartX=evt.changedTouches[0].screenX;  
              });
           
            elm.addEventListener("touchend",(evt:any)=>{
            
              touchEndX=evt.changedTouches[0].screenX;
              if(touchEndX<touchStartX && touchStartX-touchEndX>30){
                this.next_elm()
              }
              else if(touchEndX>touchStartX && touchEndX-touchStartX>30){
                this.previous_elm();
              }
            });
     })
     
      this.animation_time();
    
    }
  
    /**
     * 
     *  Auto scroll animation in every 3000 ms
     * 
     */
    animation_time():void{
      this.timerAnimation=setInterval(()=>{
        this.next_elm();
       },3000);
    }
    // Called when the element is removed from the DOM
    disconnectedCallback(): void {
      console.log('Custom element removed from the page.');
    }
  
    // Called when one of the observed attributes changes
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
      const wrapper = this.shadowRoot?.querySelector('div');
      if (name === 'label' && wrapper) {
        wrapper.textContent = newValue;
      }
    }


    
/**
 *  
 *  1.  Set the index of the next slide to currentElementSlide.
    2.  Set the index of the currently active slide to previousSlide.
    3.  Add the CSS class carousel-item-move-left to carouselItem[previousSlide] 
        to apply the exit animation from the right.
    4.  Add the CSS class active to carouselItem[currentElementSlide] 
        to apply the entry animation from the right.
    5.  After the full animation completes (600ms duration), remove the carousel-item-move-left class 
        from all carousel items and remove the active class from all carousel items 
        whose index is not equal to currentElementSlide.
 *         
 */



private next_elm=()=>{
 // clearInterval(this.timerAnimation);
  /**
   *  Calculate current element slide index value
   *   
   */
  this.currentElementSlide=this.currentElementSlide<this.carouselItems.length-1?++this.currentElementSlide:0;
  /**
   *  Calculate previous element slide index value
   * 
   */
  var previousSlide=this.currentElementSlide>0?this.currentElementSlide-1:this.carouselItems.length-1;


setTimeout(()=>{
  /**
   *  Iterate over all carouselItems
   */
  this.carouselItems.forEach((elm,index)=>{
    /**
     *     add css class carousel-item-move-left to carouselItems[previousSlide]
     *       
     */
 
    if(previousSlide==index){
       
        elm.classList.add('carousel-item-move-left');
    }
    /**
     *  
     *  add css class active to carouselItems[currentElementSlide]
     *  
     */
    if(index==this.currentElementSlide){
      elm.classList.add('active');
    
  }                
})
},0)

setTimeout(()=>{
/**
* 
*  After completing full animation i.e. after 300ms remove css class carousel-item-move-left
*  and remove css class active from carouselItems where index!=currentElementSlide
* 
* 
*/
this.carouselItems.forEach((elm,index)=>{
  /**
   * 
   *  remove css class carousel-item-move-left from all carouselItems
   * 
   */
elm.classList.remove('carousel-item-move-left');
/**
 *   remove css class active from carouselItems where index!=currentElementSlide
 * 
 */
  if(index!=this.currentElementSlide){
    elm.classList.remove('active');
  }                
})
},500)

/**
* 
*    if bullet Item index= currentElementSlide
*                    then add css class bullet-active
*                    else 
*                         remove css class bullet-active
* 
*/

this.bulletItems.forEach((elm,index)=>{
elm.classList.remove('bullet-active');
if(index==this.currentElementSlide){
  elm.classList.add('bullet-active');
}else{
  elm.classList.add('bullet-de-active');
}
})

}

/**
*    1.  Set the index of the next slide to currentElementSlide.
  2.  Set the index of the currently active slide to previousSlide.
  3.  Add the CSS class carousel-item-previous to carouselItems[currentElementSlide] to position 
      this slide on the left side of the currently active slide (carouselItems[previousSlide]).

  4.  Add the CSS class carousel-item-move-right to carouselItems[previousSlide] to apply 
      the exit animation through the right side.

  5.  Add the CSS class active to carouselItems[currentElementSlide] to apply the 
      entry animation from the right side.

*/

private previous_elm=()=>{
  clearInterval(this.timerAnimation);
/**
*   calculate currentElementSlide index
*   and previousSlide index
* 
*/
this.currentElementSlide= this.currentElementSlide<this.carouselItems.length-1?++this.currentElementSlide:0;
var previousSlid=this.currentElementSlide!=0?this.currentElementSlide-1:this.carouselItems.length-1;
if(this.currentElementSlide==1){
this.currentElementSlide=this.carouselItems.length-1;
} else{
  this.currentElementSlide=previousSlid-1;
}

/**
* Add css carousel-item-previous  class to carouselItems[currentElementSlide] to place this slide 
*            at the left side of currently active slide i.e. carouselItems[previousSlide].
* 
*/
this.carouselItems.forEach((elm,index)=>{

  if(index==this.currentElementSlide){
    elm.classList.add('carousel-item-previous');
  }
})

/**
*  
*  Add css  class active to carouselItems[currentElementSlide] only
*  Add css class carousel-item-move-right to carouselItems[previousSlide] for exit animation through right side animation
* 
*/
setTimeout(()=>{
this.carouselItems.forEach((elm,index)=>{
  elm.classList.remove('active');
  if(index==this.currentElementSlide){
    elm.classList.remove('carousel-item-previous');
    elm.classList.add('active')
  } if(index==previousSlid){
    elm.classList.add('carousel-item-move-right'); 
  }
})
},30)
setTimeout(() => {
this.carouselItems.forEach((elm,index)=>{
  elm.classList.remove('carousel-item-move-right');
  elm.classList.remove('carousel-item-previous');
  /*
         Remove Active Class for all elements accept current element
  */
  if(index!=this.currentElementSlide)
  {
    elm.classList.remove('active');
  }
})
}, 600);


this.bulletItems.forEach((elm,index)=>{
    elm.classList.remove('bullet-active');
if(index==this.currentElementSlide){
      elm.classList.add('bullet-active');
}else{
  elm.classList.add('bullet-de-active');
}
})

}


private bulletedElement=(element :Element,index:number)=>{
     
  var bulletElementValue=index;
 // alert(bulletElementValue);
  /**
   * 
   *   If the current element slide number is less than the bullet index, then:

          1.  Move carouselItems[currentElementSlide] to the left.
          2.  Move carouselItems[bulletIndex] from the right into the viewport.
          3.  After the animation completes, remove the CSS class carousel-item-move-left.
          4.  Remove the CSS active class from all carouselItems where the index is not equal to bulletIndex.
   * 
   */
  if(this.currentElementSlide<bulletElementValue){
    
    setTimeout(()=>{
      
      this.carouselItems.forEach((elm,index)=>{
        
        if(this.currentElementSlide==index){
        
            elm.classList.add('carousel-item-move-left');
        }
        if(index==bulletElementValue){
          elm.classList.add('active');
        
      }                
    })
 },3)

 setTimeout(()=>{
    this.carouselItems.forEach((elm,index)=>{
    elm.classList.remove('carousel-item-move-left');
      if(index!=bulletElementValue){
        elm.classList.remove('active');
      }                
    })
    this.currentElementSlide=bulletElementValue<this.carouselItems.length?bulletElementValue:0;
  },600)
    
  }

  /**
   * 
   * If the current element slide number is greater than the bullet index, then:

      1.  Position carouselItems[bulletIndex] before the current slide.
      2.  Exit carouselItems[currentElementSlide] to the right.
      3.  Move carouselItems[bulletIndex] from the left into the viewport.
      4.  After the animation completes, remove the CSS classes carousel-item-move-right and carousel-item-previous.
      5.  Remove the CSS active class from all carouselItems where the index is not equal to bulletIndex.
   *    
   */
  if(this.currentElementSlide>bulletElementValue){
      this.carouselItems.forEach((elm,index)=>{


        if(index==bulletElementValue){
          elm.classList.add('carousel-item-previous');
         
        }
      })

      setTimeout(()=>{
        this.carouselItems.forEach((elm,index)=>{
          if(index==bulletElementValue){
            elm.classList.add('active')
          } if(index==this.currentElementSlide){
            elm.classList.add('carousel-item-move-right'); 
          }
        })
        this.currentElementSlide=bulletElementValue;
      },0)
      setTimeout(() => {
        this.carouselItems.forEach((elm,index)=>{
          elm.classList.remove('carousel-item-move-right');
          elm.classList.remove('carousel-item-previous');
          /*
                 Remove Active Class for all elements accept current element
          */
          if(index!=this.currentElementSlide)
          {
            elm.classList.remove('active');
          }
        })
      }, 0);
  }

  this.bulletItems.forEach((elm,index)=>{
    elm.classList.remove('bullet-active');
    elm.classList.add('bullet-de-active');
  })
  element.classList.add('bullet-active');
 
}


  }
  
  // Define the custom element
  customElements.define('sk-carousel', Carousel);
