const url = "../docs/c4611_sample_explain.pdf"; 

// The doc we get from pdf js by default
let pdfDoc = null,
    pageNum = 1,
    // When rendering method is running this will be set to true
    pageIsRendering = false,
    // This is to show if we are fetching multiple pages
    pageNumIsPending = false;

const scale = 1.5,
    canvas = document.querySelector('#page-render'),
    ctx = canvas.getContext('2d');


// Render Page
const renderPage = num => {
    pageIsRendering = true;

      // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            } 
        });

        // Output current page number 

        document.querySelector('#page-num').textContent = num
    });



}

// Check for pages rendering 

const queueRenderPage = num => {
    if(pageIsRendering) {
        pageNumIsPending = num;

    } else {
        renderPage(num);
    }
}

// Get me the previous page 

const showPreviousPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

// Get me the next page 

const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}



// Getting the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    // Setting the global pdfdoc to this pdfDoc_
    pdfDoc = pdfDoc_;
   
    // Setting the total number of pages
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
});

// Previous and Next page button events

document.querySelector('#prev-page').addEventListener('click', showPreviousPage);

document.querySelector('#next-page').addEventListener('click', showNextPage);
