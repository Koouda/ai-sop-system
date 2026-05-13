export default function OperationForm({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  assignedTo,
  setAssignedTo,
  dueDate,
  setDueDate,
  analyzing,
  analyzeOperation,
  analysis,
  loading,
  createOperation,
  message,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">

      <div>
        <h2 className="text-2xl font-bold">
          Create Operation
        </h2>

        <p className="text-gray-500 mt-2">
          Capture and analyze operational requests
        </p>
      </div>

      <input
        className="w-full border rounded-xl px-4 py-3"
        placeholder="Operation title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded-xl px-4 py-3 h-32"
        placeholder="Operation description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <select
        className="w-full border rounded-xl px-4 py-3"
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="low">
          Low Priority
        </option>

        <option value="medium">
          Medium Priority
        </option>

        <option value="high">
          High Priority
        </option>
      </select>

      <input
        className="w-full border rounded-xl px-4 py-3"
        placeholder="Assigned to"
        value={assignedTo}
        onChange={(e) =>
          setAssignedTo(e.target.value)
        }
      />

      <input
        type="date"
        className="w-full border rounded-xl px-4 py-3"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <button
        onClick={analyzeOperation}
        disabled={analyzing || !title}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold disabled:bg-gray-400"
      >
        {analyzing
          ? 'Analyzing...'
          : 'Analyze with AI'}
      </button>

      {analysis && (
        <div className="bg-gray-50 border rounded-xl p-5 space-y-3">
          <p>
            <strong>Summary:</strong>{' '}
            {analysis.summary}
          </p>

          <p>
            <strong>Category:</strong>{' '}
            {analysis.category}
          </p>

          <p>
            <strong>Urgency:</strong>{' '}
            {analysis.urgency}
          </p>

          <p>
            <strong>Suggested Action:</strong>{' '}
            {analysis.suggested_action}
          </p>
        </div>
      )}

      <button
        onClick={createOperation}
        disabled={loading || !title}
        className="w-full bg-black text-white rounded-xl py-3 font-semibold disabled:bg-gray-400"
      >
        {loading
          ? 'Saving...'
          : 'Save Operation'}
      </button>

      {message && (
        <p className="text-sm text-center text-gray-700">
          {message}
        </p>
      )}
    </div>
  )
}