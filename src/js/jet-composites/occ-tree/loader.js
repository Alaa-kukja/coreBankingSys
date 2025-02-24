define([
    'ojs/ojcomposite',
    'text!./occ-tree-view.html',
    './occ-tree-viewModel',
    'text!./component.json',
    'css!./occ-tree-style',
], function (Composite, view, viewModel, metadata) {
    Composite.register('occ-tree', {
        view: view,
        viewModel: viewModel,
        metadata: JSON.parse(metadata),
    });
});