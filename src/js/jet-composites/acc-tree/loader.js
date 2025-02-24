define([
    'ojs/ojcomposite',
    'text!./acc-tree-view.html',
    './acc-tree-viewModel',
    'text!./component.json',
    'css!./acc-tree-style',
], function (Composite, view, viewModel, metadata) {
    Composite.register('acc-tree', {
        view: view,
        viewModel: viewModel,
        metadata: JSON.parse(metadata),
    });
});