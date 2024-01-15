kernel void poly_mult_naive(global float* a, global float* b, global float* output, int n) {
    size_t i = get_global_id(0);
    if(i >= 2 * n - 1) {
        return ;
    }
    int _min = i;
    if(n - 1 < _min) {
        _min = n - 1;
    }
    output[i] = 0;
    for(int x = 0; x <= _min; ++ x) {
        int y = i - x;
        if(y < n) {
            output[i] += a[x] * b[y];
        }
    }
}