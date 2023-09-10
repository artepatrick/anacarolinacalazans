function changeImage() {
    const image = document.getElementById('imagemDupla');
    image.src = 'https://i.postimg.cc/3xtv8jnR/papelzinho-no-ch-o-01.jpg';
}

function restoreImage() {
    const image = document.getElementById('imagemDupla');
    image.src = 'https://i.postimg.cc/QCgFRcFj/papelzinho-no-ch-o-02.jpg';
}

function changeImageOnTap() {
    const image = document.getElementById('imagemDupla');

    // Check the current source and update it accordingly
    if (image.src.includes('papelzinho-no-ch-o-01.jpg')) {
        image.src = 'https://i.postimg.cc/3xtv8jnR/papelzinho-no-ch-o-02.jpg';
    } else {
        image.src = 'https://i.postimg.cc/QCgFRcFj/papelzinho-no-ch-o-01.jpg';
    }
}

// Add event listener for the touchstart event
const image = document.getElementById('imagemDupla');
image.addEventListener('touchstart', changeImageOnTap);
