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
    },

    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 14) {
            value = value.slice(0, -1)
        }

        if(value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")

        } else {
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1-$2")

        }

        return value
    },

    cepMask(value) {
        value = value.replace(/\D/g, "")
        if(value.length > 8) {
            value = value.slice(0, -1)
        }

        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        return value
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],

    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.overLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file) 
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    overLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList} = input
        
        if (fileList.length > uploadLimit) {
            alert(`Select the maximum of ${uploadLimit} photos`)
            event.preventDefault();
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })
        
        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("You reach the max number of photos")
            event.preventDefault()
            return true
        }
        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
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
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        
        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        if(photoDiv.id) {
             const removedFiles = document.querySelector('input[name="removed_files"]')
             if(removedFiles) {
                 removedFiles.value +=  `${photoDiv.id},`
             }
        }
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {

        const { target } = e
        
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.ClearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error) 
            Validate.DisplayError(input, results.error)
        
    },

    DisplayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
    },

    ClearErrors(input ) {
        const errorDiv = input.parentNode.querySelector('.error')
        if(errorDiv) {
            errorDiv.remove()
        }
    },

    isValidEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        
        if(!value.match(mailFormat) && value.length != 0) 
            error = "Invalid Email"

        return {
            error,
            value
        }
    },

    isValidCpfCnpj(value) {
        let error = null
        const clearValues = value.replace(/\D/g, "")

            if(clearValues.length > 11 && clearValues.length != 14 ){ 
                error = "Invalid CNPJ"
            }
            else if (clearValues.length < 12 && clearValues.length != 11 ) {
                error = "Invalid CPF"
        
    }

        return {
            error,
            value
        }
    },

    isValidCep(value) {
        let error  = null
        const clearValues = value.replace(/\D/g, "")

        if(clearValues.length !== 8 ){ 
            error = "Invalid CEP"
        }

        return {
            error, 
            value 
        }
    },
    allFields(e) {
        const items = document.querySelectorAll('.item input, .item select, .item textarea')

        for(item of items) {
            const message = document.createElement('div')
            message.classList.add('messages')
            message.classList.add('error')
            message.style.position = 'fixed'
            message.innerHTML = 'All fields are required'
            document.querySelector('body').append(message)

            e.preventDefault()
        }
    }
}