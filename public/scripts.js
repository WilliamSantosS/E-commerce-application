const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value)
        }, 1);
    },

    formatBRL(value) {
        value = value.replace(/\D/g, "")
        return new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    }
}

const PhotosUpload = {
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    handleFileInput(event) {
        const { files: fileList } = event.target
        
        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
    },

    hasLimit(event) {
        const { uploadLimit } = PhotosUpload
        const { files: fileList } = event.target
        
        if (fileList.length > uploadLimit) {
            alert(`Select the maximum of ${uploadLimit} photos`)
            event.preventDefault();
            return true
        }
        return false
    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)
        div.appendChild(PhotosUpload.removeButton())
        return div
    },

    removeButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close'
        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode
        console.log(photoDiv)
        const photosArray = Array.from(PhotosUpload.preview.children)
        console.log(photosArray)
        photosArray.indexOf(photoDiv)
        
        photoDiv.remove()

    }
}