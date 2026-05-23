class ViewsController {
    constructor() {}

    /** Renderiza la página principal */
    renderHome(req, res, next) {
        res.render('index', {
            title: 'Inicio'
        });
    }

    dashboard(req, res, next){
        try{
            res.render('admin/dashboard', {title: 'Dashboard'})
        }catch(error){
            console.error(error);
            res.render('error', { title: error.title})
        }
    }
}

export default new ViewsController();