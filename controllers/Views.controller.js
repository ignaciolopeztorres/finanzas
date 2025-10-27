class ViewsController {
    constructor() {}

    /** Renderiza la página principal */
    renderHome(req, res) {
        res.render('index', {
            title: 'Inicio'
        });
    }
}

export default new ViewsController();