/**
 * androidpdfviewer.js
 * This is a Android hyperloop PDF viewer for use with the Magnium Framework for Titanium
 * copyright SpiralArm Consulting Ltd 2018
 */
import Magnium, { Component } from '/system/magnium';
var Bitmap,
    Activity,
    ImageView,
    File,
    ParcelFileDescriptor,
    PDFRenderer;

// Get ref to Hyperloop code depending on platform
if(Magnium.isAndroid){
    Bitmap = require('android.graphics.Bitmap');
    Activity = require('android.app.Activity');
    ImageView = require('android.widget.ImageView');
    File = require("java.io.File");
    ParcelFileDescriptor = require("android.os.ParcelFileDescriptor");
    PDFRenderer = require("android.graphics.pdf.PdfRenderer");
}


class AndroidPDFViewer extends Component{

    // Before we generate the PDF view record the filename and any scalefactor
    beforeView({pdf=false, scaleFactor=2}) {
        this.scaleFactor = scaleFactor;
        this.pdf = pdf;
        this.pageCount = 0;        
    }

    // This is used to just get the first page and then close the  PDF - used for quick views
    getPreview() {
        this.openPDF();
        this.showPage(1);
        this.closePDF();
    }

    // This opens the PDF ready for use - IMPORTANT - MAKE SURE IT GETS CLOSED!!
    openPDF() {
        if(!this._renderer){
            if(this.pdf){
                const file = new File(this.pdf);
                if(!file.exists()){
                    throw new Error(`Selected PDF file does not exist or cannot be found - ${this.pdf}`);
                }
          
                // now access it it with PDFRenderer
                const mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
                this._renderer = new PDFRenderer(mFileDescriptor);
                this.pageCount = this._renderer.getPageCount();
            }
        }
    }


    // Display the selected PDF page
    showPage (pagenum) {

        // check if the page is valid - if not just ignore
        if( pagenum < 1 || pagenum > this.pageCount){
            throw new Error("Unable to display page - Invalid page number");
        }

        // now check if we can render the selected page
        if(this._renderer){

            const currentPage = this._renderer.openPage((pagenum - 1));
            const bitmap = Bitmap.createBitmap((currentPage.getWidth() * this.scaleFactor), (currentPage.getHeight() * this.scaleFactor), Bitmap.Config.ARGB_8888);
            currentPage.render(bitmap, null, null, PDFRenderer.Page.RENDER_MODE_FOR_DISPLAY); 

            // display bitmap
            this.image.setImageBitmap(bitmap);

            // always close the page
            currentPage.close();
        }

    }

    // Make sure we can tidy up
    closePDF() {
        if(this._renderer){
            this._renderer.close();
        }
    }

    /**
     * Generate the view required to hold the PDF Bitmap image
     */
    generateView() {

        // create the container view
        const container = Ti.UI.createView(styles.containerStyle);

        // create the required image view and add it to the container
        var activity = new Activity(Ti.Android.currentActivity);
        this.image = new ImageView(activity);
        container.add(this.image);
        return container; 

    }

}

const styles = {

    containerStyle: {
        height: Ti.UI.FILL, 
        width: Ti.UI.FILL,  
        backgroundColor: 'white'        
    }
};

export default AndroidPDFViewer;