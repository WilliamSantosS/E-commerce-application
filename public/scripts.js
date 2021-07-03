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
    uploadLimit: 6,
    handleFileInput(event) {
        const { files: fileList} = event.target
        const { uploadLimit } = PhotosUpload

        if(fileList.length > uploadLimit) {
            alert(`Select the maximum of ${uploadLimit} photos`)
            event.preventDefault();
            return 
        }
    }
}