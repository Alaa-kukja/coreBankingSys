define([
    'ojs/ojcomposite',
    'text!./login-page-view.html',
    './login-page-viewModel',
    'text!./component.json',
    'css!./login-page-style',
], function (Composite, view, viewModel, metadata) {
    Composite.register('login-page', {
        view: view,
        viewModel: viewModel,
        metadata: JSON.parse(metadata),
    });
});