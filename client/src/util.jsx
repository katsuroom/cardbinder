export const Global = {
    cardsPerPage: 9,
    pagesPerGroup: 8,
    defaultBinderSize: 9*48,
    defaultGallerySize: 9*16
};

export const LayoutMode = {
    BINDER: "BINDER",
    GALLERY: "GALLERY"
};

export const BinderLayoutConfig = {
    cardHeight: 120,
    showText: false
};

export const GalleryLayoutConfig = {
    cardHeight: 280,
    showText: true
};

export function blobTobase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(blob);
    });
}