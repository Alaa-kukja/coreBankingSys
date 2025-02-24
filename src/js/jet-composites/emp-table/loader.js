define([
    'ojs/ojcomposite',
    'text!./emp-table-view.html',
    './emp-table-viewModel',
    'text!./component.json',
    'css!./emp-table-style',
], function (Composite, view, viewModel, metadata) {
    Composite.register('emp-table', {
        view: view,
        viewModel: viewModel,
        metadata: JSON.parse(metadata),
    });
});