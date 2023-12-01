function ErrorPage() {
    return (
        <div>
            <div className="row">
                <div
                    style={{ marginTop: "50px" }}
                    className="col-md-6 offset-md-3"
                >
                    <h1 className="mt-3">Something has gone wrong!</h1>
                    <span className="lead">Click </span>
                    <a href="/" className="lead">
                        here
                    </a>
                    <span className="lead"> to return home</span>
                </div>
            </div>
        </div>
    );
}
export default ErrorPage;
