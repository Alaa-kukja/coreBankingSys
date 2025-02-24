define([
    'ojs/ojcomposite',
    'text!./term-deposit-view.html',
    './term-deposit-viewModel',
    'text!./component.json',
    'css!./term-deposit-style',
], function (Composite, view, viewModel, metadata) {
    Composite.register('term-deposit', {
        view: view,
        viewModel: viewModel,
        metadata: JSON.parse(metadata),
    });
});
