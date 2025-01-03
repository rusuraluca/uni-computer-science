const char *poly_mult_naive =
"kernel void poly_mult_naive(global float* a, global float* b, global float* output, int n) {\n"
"    size_t i = get_global_id(0);\n"
"    if(i >= 2 * n - 1) {\n"
"        return;\n"
"    }\n"
"    int _min = i;\n"
"    if(n - 1 < _min) {\n"
"        _min = n - 1;\n"
"    }\n"
"    output[i] = 0;\n"
"    for(int x = 0; x <= _min; ++ x) {\n"
"        int y = i - x;\n"
"        if(y < n) {\n"
"            output[i] += a[x] * b[y];\n"
"        }\n"
"    }\n"
"};\n";
