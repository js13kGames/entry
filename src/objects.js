function lathe(points, num_steps, subdivisions, has_cap, post_proc) {
    var prev = ZERO;
    points = reshape(points,2).map(x=>(prev=NewVector(0,...x).add(prev)))
    var all_points = range(num_steps).map(i=>{
        return points.map(x=>mat_vector_product(matrix_rotate_xy(2*Math.PI/num_steps*i), x));
    }).flat();
    var N = points.length;

    var faces = cartesian_product_map(range(N-1), range(num_steps),
                                      (z_step, theta_step) => 
                                      [(0+z_step+theta_step*N),
                                       (1+z_step+theta_step*N),
                                       (N+1+z_step+theta_step*N),
                                       (N+z_step+theta_step*N),
                                      ]
                                     );
    if (has_cap) {
        faces.push(range(num_steps).map(x=>x*N));
        faces.push(range(num_steps).reverse().map(x=>x*N+N-1));
    }
    all_points = all_points.map(post_proc || (x=>x));
    faces = faces.map(x=>x.map(y=>all_points[y%all_points.length]))
    //range(subdivisions).map(x=>
    //                        faces = subdivision(faces)
    //                       );
    return make_output_from_faces(faces);
}

function make_output_from_faces(faces) {
    var out_vertices = [];
    var out_normals = [];
    var vert_to_normal = {};

    var triangles = faces.map(face => 
                              pairs(face, (x,y) => [face[0], x, y]).slice(1)
                             ).flat(1);
    triangles.map(triangle => {
        // todo space is this called anywhere else?
        var normal = normal_to_plane(...triangle);
        triangle.map((x,i) =>
                     vert_to_normal[x.id()] = push(vert_to_normal[x.id()] || [],out_normals.length+i));
        out_vertices.push(...triangle);
        out_normals.push(normal,normal,normal);
    })

    // todo space big I can remove the mean if necessary
    out_vertices.map(vert => {
        var idxs = vert_to_normal[vert.id()]
        var idxs_normals = idxs.map(x=>out_normals[x])
        var mean_normal = reduce_mean(idxs_normals)
        if (idxs_normals.every(x=>mean_normal.dot(x) > .8)) {
            idxs.map(x=> out_normals[x] = mean_normal);
        }
    })

    
    return [out_vertices.map(x=>x._xyz()).flat(),
            out_normals.map(x=>x._xyz()).flat()]
}

/*
function load_compressed_objfile(str) {
    var data = str.split("").map(x=>x.charCodeAt(0).toString(2).padStart(8,'0')).join("").split("");
    while (data.pop() != '1'); // remove the padding bits from the string

    function get_n_bits(n) {
        return parseInt(data.splice(0,n).join(""),2);
    }

    function get_vertex() {
        return Math.round(20*(get_n_bits(bits_per_coord)-zero)/((1<<bits_per_coord)-1))/1;
    }

    var type = get_n_bits(1);
    var bits_per_coord = get_n_bits(4);
    var mirror_across_xy = get_n_bits(2);
    var zero = get_n_bits(bits_per_coord);

    var vertices = [];
    while (data.length > 0) {
        var v = NewVector(get_vertex(),get_vertex(),get_vertex());
        vertices.push(v)
    }

    [(o=>(o.x*=-1,o)),(o=>(o.y*=-1,o))].map((fn,i) => {
        if (mirror_across_xy&(i+1)) {
            vertices = concat(vertices.map(x=>x.copy()), vertices.map(fn))
        }
    })

    
    var uniq={};
    vertices.map(x=>uniq[x.id()]=x);
    vertices = Object.values(uniq)

    var sign_eps_to_0 = (x) => (Math.abs(x) < 1e-3) ? 0 : Math.sign(x);
    
    var out = {}
    vertices.map((a,i) => {
        vertices.map((b,j) => {
            if (j >= i) return;
            vertices.map((c,k) => {
                if (k >= j) return;
                var normal = normal_to_plane(a,b,c);
                if (normal.vector_length() == 0) return;
                // minify: can probably remove this early check
                // I'm going to compute this again below, and we could
                // use the computation there
                var vals = vertices.map(x=>sign_eps_to_0(normal.dot(x.subtract(a))));
                if (new Set(vals).size < 3) {
                    // this triplet forms a face of the region
                    var region = vertices.filter((v,k) => vals[k] == 0);
                    //console.log("New face", i, j, k, region);
                    var lst;
                    while (true) {
                        lst = region.sort(()=>Math.random()-.5);
                        var normals = range(lst.length-2).map(i=>normal_to_plane(lst[0],lst[i+1],lst[i+2]));
                        if (normals.every(x=>x.dot(normal)>.99))
                            break;
                    }
                    //console.log('done')
                    
                    var uid = lst.map(v=>v.id()).sort().join("_")
                    out[uid] = lst;
                }
            })
        })
    });

    var new_faces = Object.values(out);


    for (var i = 0; i < 0; i++) {
        new_faces = subdivision(new_faces)
    }

    
    return make_output_from_faces(new_faces);
}


function load2(str, subdivisions) {
    var lst = str.split("\n");
    var vertices = [null];

    var faces = [];

    lst.map(line => {
        line = line.split(" ");
    //for (var i in lst) {
        //var line = lst[i].split(" ");
        var type = line.shift();
        if (type == 'v') {
            var [a,b,c] = line.map(Number);
            vertices.push(NewVector(a, c, b));
        }
        
        if (type == 'f') {
            faces.push(line.map(x => vertices[x.split("/")[0]]))
        }
    })
    vertices.shift()

    var out;
    for (var i = 0; i < subdivisions; i++) {
        faces = subdivision(faces)
    }

    return make_output_from_faces(faces);
}
*/

// todo space big remove
function subdivision(faces) {
    var vertex_to_facepoint = {};
    var vertex_to_edgemidpoint = {};

    var face_points = faces.map(face => {
        // add this face point as being adjacent to these vertices
        var face_point = reduce_mean(face);
        face.map(x => {
            vertex_to_facepoint[x.id()] = push(vertex_to_facepoint[x.id()] || [],face_point);
        })

        var edges = [...face,face[0]];
        face.map((v1,i) => {
            var two_vecs = [v1,face[(i+1)%face.length]];
            two_vecs.map(x => {
                vertex_to_edgemidpoint[x.id()] = push(vertex_to_edgemidpoint[x.id()] || [],
                                                      reduce_mean(two_vecs));
            })
        });
        return face_point;
    });

    var new_faces = faces.map((face, index) => 
        face.map((v1,i) => {
            var v2 = face[(i+1)%face.length];
            var v3 = face[(i+2)%face.length];
            var adjacent_faces_v1 = vertex_to_facepoint[v1.id()];
            var adjacent_faces_v2 = vertex_to_facepoint[v2.id()];
            var adjacent_faces_v2_set = new Set(adjacent_faces_v2.map(x=>x.id()));
            var adjacent_faces_v3 = vertex_to_facepoint[v3.id()];
            var intersection_12 = adjacent_faces_v1.filter(x => adjacent_faces_v2_set.has(x.id()));
            var intersection_23 = adjacent_faces_v3.filter(x => adjacent_faces_v2_set.has(x.id()));

            var N = adjacent_faces_v2.length;
            var new_v2 = reduce_add([
                ...adjacent_faces_v2, // get the adjacent facepoints
                ...vertex_to_edgemidpoint[v2.id()], // get the adjacent edgepoints (doubled)
                v2.scalar_multiply((N-3)*N) // and finally weight this point
            ]).scalar_multiply(Math.pow(N,-2));
            

            return [reduce_mean([v1,v2,...intersection_12]),
                    new_v2,
                    reduce_mean([v2,v3,...intersection_23]),
                    face_points[index]]
        })
    ).flat(1)

    return new_faces
}

