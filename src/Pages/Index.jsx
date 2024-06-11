import React, { useEffect, useState } from 'react'
import Layout from '../Component/Layout'
import { makeApi } from '../helper/MakeApi'
import { toast } from 'react-toastify';
import Loader from '../Common/Loader';
import { Link } from 'react-router-dom';

export default function Index() {
  const [totalEntry, setTotalEntry] = useState([]);
  const [loading, setLoading] = useState(false)

  const getDashboard = async () => {
    setLoading(true)
    try {
      const response = await makeApi('get', "/v1/admin/dashboard");
      console.log("response at dashboard", response)
      if (response.hasError === true) {
        toast.error(response.error.message);
      } else {
        setTotalEntry(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDashboard();
  }, [])
  return (
    <>
      <Layout />
      <div className="main-content app-content">
        <div className="container-fluid">

          <div className="page-header">
            <h1 className="page-title my-auto">Dashboard</h1>
            <div>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to=''>Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xxl-3">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="mt-2">
                      <h6 className="fw-normal">Total Users</h6>
                      <h2 className="mb-0 text-dark fw-semibold">{loading ? <Loader /> : totalEntry.allusers}</h2>
                    </div>
                    <div className="ms-auto">
                      <div className="chart-wrapper mt-1">
                        <canvas id="saleschart" className="chart-dropshadow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-xxl-3">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="mt-2">
                      <h6 className="fw-normal">Active User</h6>
                      <h2 className="mb-0 text-dark fw-semibold">{loading ? <Loader /> : totalEntry.activeusers}</h2>
                    </div>
                    <div className="ms-auto">
                      <div className="chart-wrapper mt-1">
                        <canvas id="leadschart" className="chart-dropshadow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-xxl-3">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="mt-2">
                      <h6 className="fw-normal">Inactive User</h6>
                      <h2 className="mb-0 text-dark fw-semibold">{loading ? <Loader /> : totalEntry.inactiveusers}</h2>
                    </div>
                    <div className="ms-auto">
                      <div className="chart-wrapper mt-1">
                        <canvas id="profitchart" className="chart-dropshadow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}