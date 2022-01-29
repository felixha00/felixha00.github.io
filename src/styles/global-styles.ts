import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  
  button:focus, input:focus {
    box-shadow: none !important;
  }

  button[aria-selected=true], button:active, button:focus {
    background: none !important;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    background: rgba(4,4,4);
   
  }

  body {
    font-family: 'Space Grotesk', Helvetica, Arial, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    font-size: inherit;
    color:white;
    font-family: 'Space Grotesk' !important;
  }

  #root {
    min-height: 100%;
    min-width: 100%;

  }

  p,
  label {
    font-family: 'Space Grotesk';
    line-height: 1.5em;
 
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  .img-hover-zoom {
    height: inherit;
  overflow: hidden; /* [1.2] Hide the overflowing of child elements */
}

/* [2] Transition property for smooth transformation of images */
.img-hover-zoom img {
  transition: transform .5s ease;
}

/* [3] Finally, transforming the image when container gets hovered */
.img-hover-zoom:hover img {
  transform: scale(1.05);
}
  .rounded {
    border-radius:10px;
  }
  .pulse {
    border: 1px solid;
    overflow: hidden;
    position: relative;
  
  span {
    z-index: 20;
  }
  
  &:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: .2;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
    z-index: -10;
  }
  } 

.pulse:hover {
  &:after {
    left: 120%;
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
  }
  
}


`;
