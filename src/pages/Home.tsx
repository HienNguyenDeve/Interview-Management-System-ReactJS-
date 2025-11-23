const Home = () => {

    return (
        <section>
            <div>
                <h1></h1>
            </div>
            <div className="card-body border-t border-slate-300 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card bg-white shadow-md rounded-md">
                    <div className="card-header border-b p-4">
                        <h2 className="text-xl font-bold">Total Candidates</h2>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-3xl font-bold">100</p>
                    </div>
                </div>
                <div className="card bg-white shadow-md rounded-md">
                    <div className="card-header border-b p-4">
                        <h2 className="text-xl font-bold">Total Jobs</h2>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-3xl font-bold">50</p>
                    </div>
                </div>
                <div className="card bg-white shadow-md rounded-md">
                    <div className="card-header border-b p-4">
                        <h2 className="text-xl font-bold">Total Interviews</h2>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-3xl font-bold">20</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;