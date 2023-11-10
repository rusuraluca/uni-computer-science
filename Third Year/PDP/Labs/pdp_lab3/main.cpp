#include <iostream>
#include <vector>
#include <thread>
#include <cmath>
#include <algorithm>
#include <future>
#include <list>

const int MATRIX_SIZE = 100;
const int NUM_THREADS = 4;


class ThreadPool {
public:
    explicit ThreadPool(size_t nrThreads)
            :m_end(false)
    {
        m_threads.reserve(nrThreads);
        for (size_t i = 0; i < nrThreads; ++i) {
            m_threads.emplace_back([this]() {this->run(); });
        }
    }

    ~ThreadPool() {
        close();
    }

    void wait_threads() {
        for (std::thread& t : m_threads) {
            t.join();
        }
    }

    void close() {
        std::unique_lock<std::mutex> lck(m_mutex);
        m_end = true;
        m_cond.notify_all();
    }

    void enqueue(std::function<void()> func) {
        std::unique_lock<std::mutex> lck(m_mutex);
        m_queue.push_back(std::move(func));
        m_cond.notify_one();
    }

private:
    void run() {
        while (true) {
            std::function<void()> toExec;
            {
                std::unique_lock<std::mutex> lck(m_mutex);
                while (m_queue.empty() && !m_end) {
                    m_cond.wait(lck);
                }
                if (m_queue.empty()) {
                    return;
                }
                toExec = std::move(m_queue.front());
                m_queue.pop_front();
            }
            toExec();
        }
    }

    std::mutex m_mutex;
    std::condition_variable m_cond;
    std::list<std::function<void()> > m_queue;
    std::atomic<bool> m_end;
    std::vector<std::thread> m_threads;
};


int compute_matrix_element(const std::vector<std::vector<int>>& matrixA, const std::vector<std::vector<int>>& matrixB, int row, int col) {
    int result = 0;
    for (int k = 0; k < MATRIX_SIZE; k++) {
        result += matrixA[row][k] * matrixB[k][col];
    }
    return result;
}


void task_consecutive_rows(const std::vector<std::vector<int>>& matrixA, const std::vector<std::vector<int>>& matrixB, std::vector<std::vector<int>>& result, int task_id) {
    int elements_per_task = ceil((double)MATRIX_SIZE / NUM_THREADS);
    int start_row = task_id * elements_per_task;
    int end_row = std::min((task_id + 1) * elements_per_task, MATRIX_SIZE);

    for (int row = start_row; row < end_row; row++) {
        for (int col = 0; col < MATRIX_SIZE; col++) {
            result[row][col] = compute_matrix_element(matrixA, matrixB, row, col);
        }
    }
}


void task_consecutive_cols(const std::vector<std::vector<int>>& matrixA, const std::vector<std::vector<int>>& matrixB, std::vector<std::vector<int>>& result, int task_id) {
    int elements_per_task = ceil((double)MATRIX_SIZE / NUM_THREADS);
    int start_col = task_id * elements_per_task;
    int end_col = std::min((task_id + 1) * elements_per_task, MATRIX_SIZE);

    for (int col = start_col; col < end_col; col++) {
        for (int row = 0; row < MATRIX_SIZE; row++) {
            result[row][col] = compute_matrix_element(matrixA, matrixB, row, col);
        }
    }
}


void task_every_kth_elem(const std::vector<std::vector<int>>& matrixA, const std::vector<std::vector<int>>& matrixB, std::vector<std::vector<int>>& result, int task_id) {
    for (int row = task_id; row < MATRIX_SIZE; row += NUM_THREADS) {
        for (int col = 0; col < MATRIX_SIZE; col++) {
            int element = 0;
            for (int k = 0; k < MATRIX_SIZE; k++) {
                element += matrixA[row][k] * matrixB[k][col];
            }
            result[row][col] = element;
        }
    }
}


int main() {
    std::vector<std::vector<int>> matrixA(MATRIX_SIZE, std::vector<int>(MATRIX_SIZE, 1));
    std::vector<std::vector<int>> matrixB(MATRIX_SIZE, std::vector<int>(MATRIX_SIZE, 1));
    std::vector<std::vector<int>> result(MATRIX_SIZE, std::vector<int>(MATRIX_SIZE, 0));
    std::vector<std::vector<int>> result2(MATRIX_SIZE, std::vector<int>(MATRIX_SIZE, 0));

    std::vector<std::thread> threads;
    threads.reserve(NUM_THREADS);

    auto start = std::chrono::high_resolution_clock::now();

    for (int i = 0; i < NUM_THREADS; i++) {
        threads.push_back(std::thread(task_consecutive_rows, matrixA, matrixB, std::ref(result), i));

        // threads.push_back(std::thread(task_consecutive_cols, matrixA, matrixB, std::ref(result), i));

        // threads.push_back(std::thread(task_every_kth_elem, matrixA, matrixB, std::ref(result), i));
    }

    for (auto& thread : threads) {
        thread.join();
    }

    auto stop = std::chrono::high_resolution_clock::now();

    auto duration = duration_cast<std::chrono::milliseconds>(stop - start);
    std::cout << "Time taken with threads is : " << duration.count() << " milliseconds" << std::endl;

    start = std::chrono::high_resolution_clock::now();

    ThreadPool pool(NUM_THREADS);
    for (int i = 0; i < NUM_THREADS; i++) {
        pool.enqueue([i, &matrixA, &matrixB, &result2]() { task_consecutive_rows(matrixA, matrixB, std::ref(result2), i); });

        // pool.enqueue([i, &matrixA, &matrixB, &result2]() { task_consecutive_cols(matrixA, matrixB, std::ref(result2), i); });

        // pool.enqueue([i, &matrixA, &matrixB, &result2]() { task_every_kth_elem(matrixA, matrixB, std::ref(result2), i); });
    }

    pool.close();
    pool.wait_threads();

    stop = std::chrono::high_resolution_clock::now();
    duration = duration_cast<std::chrono::milliseconds>(stop - start);
    std::cout << "Time taken with thread pool is : " << duration.count() << " milliseconds" << std::endl;


    std::cout << "With thread for each task:" << std::endl;
    for (int row = 0; row < MATRIX_SIZE; row++) {
        for (int col = 0; col < MATRIX_SIZE; col++) {
            std::cout << result[row][col] << " ";
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;

    std::cout << "With thread pool:" << std::endl;
    for (int row = 0; row < MATRIX_SIZE; row++) {
        for (int col = 0; col < MATRIX_SIZE; col++) {
            std::cout << result2[row][col] << " ";
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;



    return 0;
}
