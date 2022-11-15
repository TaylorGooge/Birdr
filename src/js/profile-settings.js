var toastTrigger = document.getElementById('profileSaveBtn')
var toastLiveExample = document.getElementById('profileSaveToast')
if (toastTrigger) {
toastTrigger.addEventListener('click', function () {
var toast = new bootstrap.Toast(toastLiveExample)

toast.show()
})
}
var toastPassword = document.getElementById('passwordUpdateBtn')
var toastPasswordExample = document.getElementById('passwordUpdateToast')
if (toastPassword) {
toastPassword.addEventListener('click', function () {
var toast = new bootstrap.Toast(toastPasswordExample)

toast.show()
})
}

    let fpickr = document.querySelectorAll("[data-flatpickr]");
    fpickr.forEach(el => {
        const t = {
            ...el.dataset.flatpickr ? JSON.parse(el.dataset.flatpickr) : {},
        }
        new flatpickr(el, t)
    }
    );

    var cSelect = document.querySelectorAll("[data-choices]");
    cSelect.forEach(el => {
        const t = {
            ...el.dataset.choices ? JSON.parse(el.dataset.choices) : {}, ...{
                classNames: {
                    containerInner: el.className,
                    input: "form-control",
                    inputCloned: "form-control-sm",
                    listDropdown: "dropdown-menu",
                    itemChoice: "dropdown-item",
                    activeState: "show",
                    selectedState: "active"
                }
            }
        }
        new Choices(el, t)
    }
    );

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginFilePoster
    );

    // Select the file input and use 
    // create() to turn it into a pond
    FilePond.create(
        document.querySelector('#update_profile'),
        {
            labelIdle: `Drag & Drop picture or Browse`,
            imagePreviewHeight: 160,
            allowMultiple: false,
            allowFilePoster: true,
            filePosterHeight: 160,
            stylePanelLayout: 'compact circle',
            styleLoadIndicatorPosition: 'center bottom',
            styleProgressIndicatorPosition: 'right bottom',
            styleButtonRemoveItemPosition: 'left bottom',
            styleButtonProcessItemPosition: 'right bottom',
            files: [
                {
                    source: '12345',
                    options: {
                        type: 'local',
                        file: {
                            name: 'Profile',
                            size: false,
                            type: 'image/jpg'
                        },

                        // pass poster property
                        metadata: {
                            poster: 'img/avatar/4.jpg'
                        }
                    }
                }
            ]
        }
    );

