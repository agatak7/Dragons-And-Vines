var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

function loadImages(source, callback){
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in source){
        numImages++;
    }
    console.log(numImages);
    for(var src in source){
        images[src] = new Image();
        images[src].onload = function(){
            if(++loadedImages>= numImages){
                callback(images);
            }
        };
        images[src].src = source[src];
    }

}
var source = {
    dragon1: "images/dragon1.png",
    dragon2: "images/dragon2.png",
    dragon3: "images/dragon3.png",
    vine1: "images/vine1.png",
    vine2: "images/vine2.png"
};
loadImages(source,function(images){
    context.drawImage(images.dragon2, 50, 50, images.dragon2.width*0.2, images.dragon2.height*0.2);
    context.drawImage(images.dragon3, 325, -30, images.dragon3.width*0.16, images.dragon3.height*0.22);
    context.drawImage(images.dragon2, 545, 40, images.dragon2.width*0.15, images.dragon2.height*0.16);
    context.drawImage(images.dragon3, 220, 370, images.dragon3.width*0.15, images.dragon3.height*0.16);
    var TO_RADIANS = Math.PI/180; 
    function drawRotatedImage1(image, x, y, angle, scale)
    { 
        // save the current co-ordinate system 
        // before we screw with it
        context.save(); 

        // move to the middle of where we want to draw our image
        context.translate(x, y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        context.rotate(angle * TO_RADIANS);
        context.scale(scale, scale);
    
        // draw it up and to the left by half the width
        // and height of the image 
        context.drawImage(image, -(image.width/2), -(image.height/2));

        // and restore the co-ords to how they were when we began
        context.restore(); 
    }
    drawRotatedImage1(images.dragon1, 580, 450, 45, 0.26);
    drawRotatedImage1(images.dragon1, 250, 550, 120, 0.28);
    drawRotatedImage1(images.vine1 , 400, 380,15, 0.032);
    drawRotatedImage1(images.vine1 , 175, 475, 190, 0.065);
    drawRotatedImage1(images.vine2 , 450, 560, 280, 0.03);
    drawRotatedImage1(images.vine1 , 310, 170, 65, 0.042);
    drawRotatedImage1(images.vine2 , 530, 170, 265, 0.04);
    drawRotatedImage1(images.vine1 , 675, 400, 35, 0.06);
    //context.drawImage(images.vine1 , 200, 200, images.vine1.width*0.05, images.vine2.height*0.05);

});
