from flask import Flask, jsonify
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import json

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    return (
        f"Hawaii Weather Station API<br/>"
        f"Available Routes:<br/>"
        f"<a href='/api/v1.0/stations'>/api/v1.0/stations</a><br/>"
        f"<a href='/api/v1.0/precipitation'>/api/v1.0/precipitation</a><br/>"
        f"<a href='/api/v1.0/tobs'>/api/v1.0/tobs</a><br/>"
        f"<a href='/api/v1.0/2016-10-31'>/api/v1.0/START_DATE</a>  ----- (date must be yyyy-mm-dd format)<br/>"
        f"<a href='/api/v1.0/2017-05-22/2017-08-22'>/api/v1.0/START_DATE/END_DATE</a>  ----- (date must be yyyy-mm-dd format)<br/>"

    )

@app.route("/api/v1.0/stations")
def station():
    # connect to the database
    conn = engine.connect()

    # query the database into a dataframe
    query = "SELECT * FROM station;"
    df = pd.read_sql(query, con=conn)
    conn.close()
    
    # return the dataframe
    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

@app.route("/api/v1.0/precipitation")
def precipitation():
    # connect to the database
    conn = engine.connect()

    # query the database into a dataframe
    query = f"""
                SELECT
                    date,
                    avg(prcp) as avg_prcp
                FROM
                    measurement
                GROUP BY
                    date
                ORDER BY
                    date asc;
            """
    df = pd.read_sql(query, con=conn)
    conn.close()
    
    # return the dataframe
    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

@app.route("/api/v1.0/tobs")
def temperature():
    # connect to the database
    conn = engine.connect()

    # query the database into a dataframe
    query = f"""
                SELECT
                    station,
                    date,
                    tobs as temperature
                FROM
                    measurement
                WHERE
                    station = 'USC00519281'
                    and date >= '2016-08-23'
                ORDER BY
                    date asc;
            """
    df = pd.read_sql(query, con=conn)
    conn.close()
    
    # return the dataframe
    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

@app.route("/api/v1.0/<start>") # date must be yyyy-mm-dd
def startDate(start):
    # connect to the database
    conn = engine.connect()

    # query the database into a dataframe
    query = f"""
                SELECT
                    date,
                    min(tobs) as min_temp,
                    avg(tobs) as avg_temp,
                    max(tobs) as max_temp
                FROM
                    measurement
                where
                    date = '{start}'
            """
    df = pd.read_sql(query, con=conn)
    conn.close()
    
    # return the dataframe
    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

@app.route("/api/v1.0/<start>/<end>") # date must be yyyy-mm-dd
def dateRange(start, end):
    # connect to the database
    conn = engine.connect()

    # query the database into a dataframe
    query = f"""
                SELECT
                    min(date) as start_date,
                    max(date) as end_date,
                    min(tobs) as min_temp,
                    avg(tobs) as avg_temp,
                    max(tobs) as max_temp
                FROM
                    measurement
                where
                    date >= '{start}'
                    and date <= '{end}'
            """
    df = pd.read_sql(query, con=conn)
    conn.close()
    
    # return the dataframe
    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

# Run the web app
if __name__ == "__main__":
    app.run(debug=True)
