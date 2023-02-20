from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import os
import json
from datetime import datetime
import cluster_functions
import pandas as pd
import numpy as np
import tanglegram as tg
from dotenv import dotenv_values

# Load config from `.env` file
config = dotenv_values(".env")
db_path = config.get("DB_PATH")

# Instantiate the app.
app = Flask(__name__)
app.config.update(**config)

# Enable CORS.
CORS(app)

# homology ID route
@app.route('/homology_ids', methods=['GET'])
def homology_ids():    
    json_url = os.path.join(db_path, "data_homology_ids.json")
    data = json.load(open(json_url))
    return jsonify(data)

# get aligned positions from db 
@app.route('/<id>/al_pos/<slice>', methods=['GET'])
def all_pos_new(id, slice):    
    al_pos = pd.read_csv(os.path.join(db_path, id, 'al_pos.csv'))
    start = int(slice.split('-')[0])
    end = int(slice.split('-')[1])
    al_pos_small = al_pos[(start < al_pos['position']) & (al_pos['position'] < end)]
    return al_pos_small.to_csv(index=False)

# get aligned positions from db 
@app.route('/<id>/al_pos', methods=['GET'])
def all_pos(id):    
    al_pos = pd.read_csv(os.path.join(db_path, id, 'al_pos.csv'))
    al_pos_small = al_pos
    return al_pos_small.to_csv(index=False)

# get sequences from db 
@app.route('/<id>/sequences', methods=['GET'])
def sequences(id):    
    seqs = pd.read_csv(os.path.join(db_path, id, 'sequences.csv'))
    return seqs.to_csv(index=False)


# get phenos from db 
@app.route('/<id>/phenos', methods=['GET'])
def phenos(id):    
    result = pd.read_csv(os.path.join(db_path, id, 'phenos.csv')) 
    return result.to_csv(index=False)

# get variable positions from db 
@app.route('/<id>/var_pos_count', methods=['GET'])
def var_pos_count(id):    
    var_pos_count = pd.read_csv(os.path.join(db_path, id, 'var_pos_count.csv'))
    max_values = []
    # create new col for score
    for index, row in var_pos_count.iterrows():
        nrs = []
        nrs.extend([row['A'], row['C'], row['T'], row['G'], row['gap']])
        max = 0
        for i in nrs:
            if i > max:
                max= i
        max_values.append(max)
    var_pos_count['conservation'] = [i for i in max_values]
    return var_pos_count.to_csv(index=False)

# get sequences from pecto db 
@app.route('/<id>/nuc_structure', methods=['GET'])
def nuc_structure(id):    
    nuc_struct = pd.read_csv(os.path.join(db_path, id, 'nuc_structure.csv'))
    return nuc_struct.to_csv(index=False)

@app.route('/<id>/d3dendro', methods=['GET', 'POST'])
def get_d3_dendro_new(id):

    data_sequences = pd.read_csv(os.path.join(db_path, id, 'sequences.csv'))
    linkage_matrix = np.load(os.path.join(db_path, id, "linkage_matrix.npy"))
    data_labels = data_sequences['mRNA_id'].to_list()

    if request.method == 'POST':
        print('create interactive dendrogram')
        
        numbers_to_remove = request.json['selected_items']
        numbers_to_remove = [int(i) for i in numbers_to_remove]

        selected_data_matrix = cluster_functions.create_lv_matrix(data_sequences, numbers_to_remove)
        selected_linkage_matrix= cluster_functions.create_linkage_matrix(selected_data_matrix, output_file=None)
       
        ## get untangled matrix
        untangled = tg.untangle(selected_linkage_matrix, linkage_matrix, data_labels, data_labels, method="step1side")

        linkage_matrix = untangled[0]
    
    d3_dendro = cluster_functions.create_d3_dendrogram(linkage_matrix, data_labels)

    return d3_dendro


@app.route('/core_snp', methods=['GET'])
def core_snp_tree():    
    txt_url = os.path.join(db_path, "core_snp.txt")
    data = open(txt_url, "r")
    return data.read()


# Airplay sharing port 5000 disabled 
# https://developer.apple.com/forums/thread/693768
if __name__ == '__main__':
    app.run() 
