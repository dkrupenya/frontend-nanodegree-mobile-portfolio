## Website Performance Optimization portfolio project

Make `npm install` and run `gulp` command in the main folder, the project will be compiled to `/build` folder. 

####Part 1: Optimize PageSpeed Insights score for index.html
 *load google analytics script async                                             
 *add media="print" for print.css                                         
 *create small pizzeria image for index page                              
 *move js down                                                            
 *load images through http instead of https                                         

####Part 2: Optimize Frames per Second in pizza.html
 *decrease pizzeria img size and quality for pizza.html                   
 *updatePositions(): replace dom queries with prestored array                                         
 *updatePositions(): remove document.body.scroll call from cycle - greatly improve frame rate 
 *set fixed moving pizza size (no more resize events)                     
 *optimize changePizzaSizes   
 *nice css hack to force elements into their own composite layer
                                             
####Gulp tasks  
 *add css autoprefixer                                          
 *minify  js and css                                            
  
                                         
Size and quality of the pictures were optimized manually.                                        
 
