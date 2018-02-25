/**
 * androidpdfviewer.js
 * This is a Android hyperloop PDF viewer for use with the Magnium Framework for Titanium
 * copyright SpiralArm Consulting Ltd 2018
 */
import Magnium, { Component } from '/system/magnium';
var 
    Activity,
    ImageView,
    File,
    ParcelFileDescriptor,
    PDFRenderer;

// Get ref to Hyperloop code depending on platform
if(Magnium.isAndroid){
   Activity = require('android.app.Activity');
    ImageView = require('android.widget.ImageView');
    File = require("java.io.File");
    ParcelFileDescriptor = require("android.os.ParcelFileDescriptor");
    PDFRenderer = require("android.graphics.pdf.PdfRenderer");
}


class AndroidPDFViewer extends Component{

    // Before we generate the PDF view record the filename and any scalefactor
    beforeView({pdf=false, scaleFactor=1}) {
        this.scaleFactor = scaleFactor;
        this.pdf = pdf;
        this._mFileDescriptor = null; 
        this._renderer = null;     
    }

    // This is used to just get the first page and then close the  PDF - used for quick views
    getPreview() {
        this.openPDF();
        this.showPage();
        this.closePDF();
    }

    // This opens the PDF ready for use - IMPORTANT - MAKE SURE IT GETS CLOSED!!
    openPDF() {
        if(this._renderer == null){
            const file = new File(this.pdf);
            if(!file.exists()){
                throw new Error(`Selected PDF file does not exist or cannot be found - ${this.pdf}`);
            }
            this._mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            if(this._mFileDescriptor != null){
                this._renderer = new PDFRenderer(this._mFileDescriptor);
            }
        }
    }

    pageCount() {
        return this._renderer.getPageCount();
    }

    // Display the selected PDF page
    showPage (pagenum=1) {
 
        // remove any existing image
        this.image.setImageBitmap(null);

        // check if the page is valid - if not just ignore
        if( pagenum < 1 || pagenum > this._renderer.getPageCount()){
            throw new Error("Unable to display page - Invalid page number.");
        }

        // if currentPage close it first
        if(this._currentPage != null){
            this._currentPage.close();
            this._currentPage = null;
        }

        // now check if we can render the selected page
        if(this._renderer){
            const Bitmap = require('android.graphics.Bitmap');
            this._currentPage = this._renderer.openPage((pagenum - 1));
            const pagebmp = Bitmap.createBitmap((this._currentPage.getWidth() * this.scaleFactor), (this._currentPage.getHeight() * this.scaleFactor), Bitmap.Config.ARGB_8888);
            this._currentPage.render(pagebmp, null, null, PDFRenderer.Page.RENDER_MODE_FOR_DISPLAY); 
            this.image.setImageBitmap(pagebmp);
        }

    }

    // Make sure we can tidy up
    closePDF() {

        if(this._currentPage != null){
            this._currentPage.close();
            this._currentPage = null;
        }
        
        if(this._renderer){
            this._renderer.close();
            this._renderer = null;
        }

        if(this._mFileDescriptor){
            this._mFileDescriptor.close();
            this._mFileDescriptor = null;
        }        
    }

    /**
     * Generate the imageView required to hold the PDF Bitmap image
     */
    generateView() {
        var activity = new Activity(Ti.Android.currentActivity);
        this.image = new ImageView(activity);
        return this.image; 
    }


    destroy() {
        this.closePDF();
        this.image = null;
    }

}


export default AndroidPDFViewer;