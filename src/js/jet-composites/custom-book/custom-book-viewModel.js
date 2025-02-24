define([
    'ojs/ojtranslation',
    'utils/Core',
    'ojs/ojavatar',
    'oj-c/rating-gauge',
    'ojs/ojbutton',
    'ojs/ojdialog',
], function (Translations, CoreUtils) {
    const _t = Translations.getTranslatedString;
    function customBooksViewModel(context) {
        this._initAllIds();
        this._initAll_Labels();
        this._initAllVariables(context);
        this._initAllEventListeners(context);
    }

    customBooksViewModel.prototype._initAllIds = function () {
        this.favoriteTestDialog = CoreUtils.generateUniqueId();
        this.closeTestDialog = CoreUtils.generateUniqueId();
    };

    customBooksViewModel.prototype._initAll_Labels = function () {
        this.addToCartLabel = _t('buttons.addToCart');
        this.addToListLabel = _t('buttons.addToList');
    };

    customBooksViewModel.prototype._initAllVariables = function (context) {
        this.bookId = context.properties.bookId;
        this.bookTitle = context.properties.bookTitle;
        this.bookAuthor = context.properties.author;
        this.bookType = context.properties.type;
        this.bookRating = context.properties.bookRating;
    };

    customBooksViewModel.prototype._initAllEventListeners = function (context) {
        this.handleAddToCart = () => {
            alert(`Add To Cart ${this.bookTitle}`);
        };
        this.handleAddToList = () => {
            document.getElementById(this.favoriteTestDialog).open();
        };

        this.closeFavoriteTestDialog = () => {
            document.getElementById(this.favoriteTestDialog).close();
        };
    };

    return customBooksViewModel;
});
