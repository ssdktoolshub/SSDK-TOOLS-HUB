# SSDK TOOLS HUB — Search Test & Benchmark Report

**Total Indexed Tools:** 967
**Search Quality Score:** 100.0% (22/22 test cases passed)

## Performance Latency Benchmarks (Measured over 100 Query Executions)

- **Average Latency:** `2.459 ms`
- **Fastest Query:** `0.987 ms`
- **99th Percentile Max:** `4.754 ms`

## Test Matrix Breakdown

| Test Type | Query | Top Result | Result Count | Latency | Status | Details |
|---|---|---|---|---|---|---|
| Exact | `"JSON Formatter"` | JSON Formatter | 92 | 9.831 ms | ✅ PASS | Found 'JSON Formatter' (#1) |
| Exact | `"PDF Merge"` | Merge PDF | 60 | 6.274 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Exact | `"Image Compressor"` | Image Compressor | 86 | 4.825 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Exact | `"Age Calculator"` | Age Calculator | 323 | 4.838 ms | ✅ PASS | Found 'Age Calculator' (#1) |
| Exact | `"Password Generator"` | Password Generator | 234 | 4.999 ms | ✅ PASS | Found 'Password Generator' (#1) |
| Partial | `"json"` | JSON Formatter | 92 | 2.916 ms | ✅ PASS | Top result 'JSON Formatter' is in category '🛠 Developer Tools' |
| Partial | `"pdf"` | PDF to JPG | 57 | 2.736 ms | ✅ PASS | Top result 'PDF to JPG' is in category '📄 PDF Tools' |
| Partial | `"image"` | Image Compressor | 80 | 2.165 ms | ✅ PASS | Top result 'Image Compressor' is in category '🖼 Image Tools' |
| Partial | `"qr"` | QR Code Generator | 149 | 1.143 ms | ✅ PASS | Found 'QR Code Generator' (#1) |
| Typo | `"imge compres"` | Image Compressor | 31 | 3.434 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Typo | `"calclator"` | Age Calculator | 169 | 2.880 ms | ✅ PASS | Found matching category results for typo query |
| Typo | `"pdf merg"` | Merge PDF | 60 | 2.985 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Typo | `"resizr"` | Image Resizer | 3 | 2.171 ms | ✅ PASS | Found 'Image Resizer' (#1) |
| Synonym | `"join pdf"` | Merge PDF | 60 | 2.666 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Synonym | `"combine pdf"` | Merge PDF | 60 | 3.502 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Synonym | `"reduce image size"` | Image Compressor | 98 | 5.647 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Synonym | `"remove bg"` | Background Remover | 24 | 3.238 ms | ✅ PASS | Found 'Background Remover' (#1) |
| Synonym | `"word count"` | Word Counter | 65 | 3.499 ms | ✅ PASS | Found 'Word Counter' (#1) |
| Multi-Word | `"compress jpg image"` | Image Compressor | 89 | 4.390 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Multi-Word | `"calculate compound interest"` | Compound Interest Calculator | 173 | 7.888 ms | ✅ PASS | Found 'Compound Interest Calculator' (#1) |
| Category-Aware | `"developer json"` | JSON Formatter | 140 | 3.892 ms | ✅ PASS | Top result 'JSON Formatter' is in category '🛠 Developer Tools' |
| Category-Aware | `"medical cbc"` | CBC Report Analyzer | 174 | 2.981 ms | ✅ PASS | Top result 'CBC Report Analyzer' is in category '🩺 Medical & Laboratory Tools' |
